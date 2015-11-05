/**
 * Created by Pranab Agarwal on 11/5/2015.
 */

Template.home.onRendered(function(){

    console.log("home.js: Inside onRendered");

    //var sessionId = new Meteor.Collection.ObjectID()._str;

    var collabIp = "100.100.100.100";
    var collabName = "Test";
    var collabColor = "Orange";

    var createdAt = new Date();
    var updatedAt = new Date();

    var sessionId = DrawSessions.insert({
        createdAt: createdAt,
        updatedAt: updatedAt,
        collabList:[{
            collabIp:       collabIp,
            collabName:     collabName,
            collabColor:    collabColor
        }]

    },
    function(error, result) {
        if (error) {
            console.log("Error:" + error.reason);
            return;
        }
        else {
            console.log("inside session callback");
            console.log("/" + sessionId);
            Router.go("/" + sessionId) ;
        }
    });



});


Template.home.events({

});


Template.home.helpers({

});


