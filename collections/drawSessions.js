/**
 * Created by Pranab Agarwal on 11/5/2015.
 */

DrawSessions = new Meteor.Collection('drawSessions');

DrawSessions.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});