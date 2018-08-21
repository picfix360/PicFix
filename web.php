<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('chat','ChatController@chat');
Route::post('send','ChatController@send');
Route::post('saveToSession','ChatController@saveToSession');
Route::delete('deleteSession','ChatController@deleteSession');
Route::get('getOldMessage','ChatController@getOldMessage');
Route::get('check',function(){
    return session('chat');
});






































Route::get('/tg', function () {
    return view('toggle');
});

Route::get('/get', function () {
    if(Request::ajax()){
        return 'Get Request loaded Successfuly';
    }
});

Route::get('/show',function ()
{
    return view('comment');
});
Route::get('/comments', 'CommentController@fetchMessages');
Route::post('/comments', 'CommentController@sendMessage');

Route::post('/reg', 'Designer\DesignerController@store');


Route::post('/order','OrderController@store');

Route::post('/upload', 'OrderDetailController@store');









Route::group(['prefix' => 'admin', 'middleware' => ['role:Admin']], function() {

    Route::get('/', function ()
    {

        return view('admin.index');
    })->name('admin');

    Route::get('/admin','Admin\AdminController@welcome');

});




Route::group(['prefix' => 'designer', 'middleware' => ['role:Designer']], function() {

 /*   Route::get('/', function ()
    {
        return view('designer.index');

    })->name('designer');*/

    Route::get('/','Designer\DesignerController@index')->name('designer');
    Route::get('/order/{id}','Designer\DesignerController@show');



});



Route::group(['prefix' => 'client', 'middleware' => ['role:Client']], function() {

    Route::get('/', 'Client\ClientController@index')->name('client');

});


Route::group(['prefix' => '', 'middleware' => ['role:Client']], function() {


    Route::get('/clnt',function ()
    {
        echo "Ok  ";
        return Auth::user()->roles->first()->name;
    });
    Route::get('/orders','OrderController@index');
});

//Route::get('/admin', 'AdminController@welcome')->name('admin');


Auth::routes();

Route::get('/home', 'HomeController@index')->name('Home');

Route::get('/user/activation/{email_token}', 'Auth\RegisterController@userActivation');
