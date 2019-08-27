const express 	= require('express');
const bodyParser= require('body-parser');	//midllwele
const hbs 		= require('hbs');			//use hbs module
const path 		= require('path');			//use path module
const {Client} = require ('pg');			//conecction data base
const flash		= require('express-flash');	//alenrt
const session 	= require('express-session');//untuk menampung data alern
const app		= express();				//instansiasi express


//------------------------------------------------------------------------------------------------------------

app.set('views',path.join(__dirname,'views'));	//set dynamic views fiel
app.set('view engine', 'hbs');					//set view engine

//set folder public untuk static folder untuk file
app.use('/assets',express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Pemberitauan alert-------------------------------------------------------------------------------------------
app.use(flash());
app.use(session({
	secret	: "Abidin",
	resave	: false,
	saveUninitialized: true
}));


//conection----------------------------------------------------------------------------------------------------
//pemakaian modul psotgre untuk penggunaan data base
const conn = new Client({
					user :'postgres',
					password:'12345',
					host:"localhost",			//bisa 127.0.0.1
					post:5432,
					database:"nodejs_posgre"
});
conn.connect((err)=>{
	if(err)throw err;
	console.log('connect successfully');
});


//routing halaman utama(/)----------------------------------------------------------------------------------------
app.get('/',(req, res)=>{
	let sql = "SELECT id, nama_lengkap, TO_CHAR(tanggal_lahir, 'dd-mm-yyyy') tanggal_lahir, alamat FROM siswa";
	conn.query(sql,(err,results)=>{
	if(err)throw err;
	res.render('siswa_list',{			
		results:results.rows		//data yang dilempar
/*		res.status(200).send(results.rows)
*/		});
	});
});


//route untuk insert data-------------------------------------------------------------------------------------
app.post('/save',(req,res)=>{
	let sql  = "INSERT INTO siswa (nama_lengkap,tanggal_lahir,alamat) values ('"+req.body.nama_lengkap+"','"+req.body.tanggal_lahir+"','"+req.body.alamat+"')";
	conn.query(sql, (err, results)=>{
		if (err) throw err;
		req.flash('info','Data Sukses')//notifikasi alenrt
		res.redirect('/');
	});
});

//Update atau Edit----------------------------------------------------------------------------------------------
app.post('/update',(req,res)=>{
	let sql  = "UPDATE siswa SET nama_lengkap='"+req.body.nama_lengkap_edit+"', tanggal_lahir='"+req.body.tanggal_lahir_edit+"', alamat='"+req.body.alamat_edit+"' WHERE id="+req.body.product_id_edit;
	let query = conn.query(sql, (err, results)=>{
		if (err) throw err;
/*		req.flash('info','Update Data Sukses')//notifikasi
*/		res.redirect('/'); 								//balikan
	});
});

//delete------------------------------------------------------------------------------------------------------
app.post('/delete',(req,res)=>{
	let sql  = "DELETE FROM siswa WHERE id="+req.body.id_delete; /*isi sesuia id product*/
	let query = conn.query(sql, (err, results)=>{
		if (err) throw err;
		req.flash('info','Update Data Sukses')//notifikasi
		res.redirect('/');
	});
});


//server listening-----------------------------------------------------------------------------------------
app.listen(8000, ()=>{
	console.log('server is running at port 8000');
});