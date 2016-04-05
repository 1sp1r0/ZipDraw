/*******************************************************
 * Copyright (C) 2015-2025 Pranab Agarwal <pranab@gmail.com>
 * resident of C-153 East of Kailash, New Delhi - 65, India
 * ALL RIGHTS RESERVED
 * This file can not be copied and/or distributed without
 * the express written permission of Pranab Agarwal
 *******************************************************/

//ZipBoard Server Methods Core - Maintained by Pranab Agarwal
//Do Not Make changes, unless you know what you are doing :)

Meteor.methods({

    //Validates if User exists, using Email
    //Called from (a) SignUp, (b) addOrgMember, and (c) AddCollaboratorModal
    //getUserWithEmail: function(email) {
    //    var user = Meteor.users.findOne({
    //        'emails.address': email
    //    });
    //    if (user) return user;
    //    else return null;
    //}

    testSlackAPI: function() {
        //
        //// async calls
        //SlackAPI.api.test({good: 1}, function (err, res) {
        //    console.log(err); // will return null
        //    console.log(res); // will return {"ok":true, "args":{good:1}}
        //});
        //
        //SlackAPI.api.test({good: 1, error: 1}, function (err, res) {
        //    console.log(err); // will return {"ok":false, "error":1, "args":{good:1, error:1}}
        //    console.log(res); // will return undefined
        //});
        //
        //// sync calls
        //SlackAPI.api.test({good: 1}); // return {"ok":true, "args":{good:1}}
        //SlackAPI.api.test({good: 1, error: 1}) // return  {"ok":false, "error":1, "args":{good:1, error:1}}

        //SlackAPI.auth.test("xoxp-11200881605-11198687891-32030661536-e897f3932a", function (err, res) {
        //    console.log("Auth Error:" + err);
        //    console.log("Auth Result:" + res);
        //});

    }

});
