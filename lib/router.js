/**
 * Created by Pranab Agarwal on 11/5/2015.
 */

//ZipDraw Navigation Core - Maintained by Pranab Agarwal

//.configure is used to set Defaults
//using this function, to pull up Login page
//for random urls, like http://localhost:3000/abcdef
//Router.configure({
//    notFoundTemplate: 'home',
//    layoutTemplate: 'drawTemplate'
//});

Router.route('home', {
    path: '/',
    layoutTemplate: 'drawTemplate'
    //
    //action: function() {
    //    //Set Session Variables, if any
    //
    //    //this.render('home');
    //},
    //
    //onBeforeAction: function(){
    //
    //}
});

Router.route('draw', {
    path: ':_id',
    layoutTemplate: 'drawTemplate',
    loadingTemplate: 'spinner'

    //waitOn: function() {
    //    var sessionId = this.params._id;
    //},
    //
    //data: function() {
    //    if(this.ready()){
    //        return {
    //
    //        }
    //    }
    //},
    //
    //action: function() {
    //    //Set Session Variables, if any
    //
    //    this.render('draw');
    //},
    //
    //onBeforeAction: function(){
    //
    //}
});
