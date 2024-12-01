import  pg from 'pg';//

var conString = "postgres://postgres:postgres@localhost:5432/integrador";//
var client = new pg.Client(conString);//
client.connect()//

export default client;