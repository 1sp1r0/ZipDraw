/**
 * Created by Pranab Agarwal on 11/5/2015.
 */

Template.canvas.helpers({

    makePath: function() {
        var paths = [];
        var sessionId = Session.get('sessionId');
        var sessionData = DrawSessions.findOne({'_id': sessionId});

        if (sessionData) {
            if (sessionData.annotations) {
                for (var i = 0; i < sessionData.annotations.length; i++) {
                    paths.push(sessionData.annotations[i]);
                }
            }
        }

        return paths;
    }
});

Template.canvas.events({

    'click path': function(event) {
        if (Session.get('tool') == "erase") {
            var id = $(event.target).attr('id');
            canvas.deleteAnnotation(id);
        }
    }
});

Template.draw.helpers({

});

Template.draw.onRendered(function() {

    //$("#boardClose").hide();
    //$(".toolbar-mwrap").hide();
    //$(".sl-mainwrap").css("visibility", "hidden");
    //$("#canvas").hide();
    //$('[data-toggle="popover"]').popover();
    //$('#commentArea').css('visibility', 'hidden');
    //$('#pan').addClass("activeIcon");
    //Session.set('tool', "pan");
    //$("#iframe_box").draggable();
    //if (window.devicePixelRatio > 1) {
    //    $('#currentScreenshot img').css({
    //        zoom: 1 / window.devicePixelRatio
    //    });
    //}
    //$("#iframe_box").draggable("enable");
    //   var winHeight = $(window).height();
    //    winHeight -= 140; //Remove Pixels for Toolbar, and Comments Accordian
    //    $(".hightBoard").css({
    //    "height": winHeight
    //});

    Session.set('tool', "pencil");
    Session.set('zoomed', 1);
});

Template.draw.events({
    'change #colorChoice' : function(event) {
            $(".nameColor").css('color', $(this).val());
    },

    'click #userProfile' : function(event) {
        {

            if(userBar == false){
                $("#userProfileBar").show();
                /*$("#userProfileBar").addClass("boxEffectOpen");
                $("#userProfileBar").removeClass("boxEffect");*/
                userBar = true;
            } else{
                $("#userProfileBar").hide();
                /*$("#userProfileBar").removeClass("boxEffectOpen");
                $("#userProfileBar").addClass("boxEffect");*/
                userBar = false;
            }
        };
    },
    'click #shareOwnLink' : function(event) {
        {
            Meteor.call('testSlackAPI', function (err) {
                if (err) {
                    console.log("Error:" + err.reason);
                    return;
                }
            });


            //if(userBar == false){
            //    $("#shareLink").show();
            //
            //    userBar = true;
            //} else{
            //    $("#shareLink").hide();
            //    userBar = false;
            //}


        };
    },

'click #boardExpand' : function(event) {

    {
        console.log("false");
        if(chat == false){
            $(".comment-wrap").animate({"right":"-250px"});
            $(".content-wrap").css({"margin-right":"0"});
            chat = true;
        } else{
            console.log("true");
            $(".comment-wrap").animate({"right":"0"});
            $(".content-wrap").css({"margin-right":"250px"});
            chat = false;
        }
    };
},




    // Event Handler for ZoomIn
    'click #zoom-in': function(event) {
        rendered();
        canvas.zoomIn();
    },
    // Event Handler for ZoomOut
    'click #zoom-out': function(event) {
        rendered();
        canvas.zoomOut();
    },
    // Event Handler for 1:1
    'click #extent': function(event) {
        rendered();
        canvas.extent();
    },
    // Event Handler for Using pencil tool
    'click #draw-pencil': function(event) {

        $(".activeIcon").removeClass("activeIcon");
        $(event.target).addClass("activeIcon");

        Session.set('tool', "pencil");
        rendered();
        canvas.drawCurve();
    },
    // Event Handler for using arrow tool
    'click #draw-arrow': function(event) {
        console.log("inside #draw-arrow");

        $(".activeIcon").removeClass("activeIcon");
        $(event.target).addClass("activeIcon");

        Session.set("tool", "arrow");
        rendered();
        canvas.drawCurve();
    },
    // Event Handler for using rectangle tool
    'click #draw-rect': function(event) {
        console.log("inside #draw-rect");

        $(".activeIcon").removeClass("activeIcon");
        $(event.target).addClass("activeIcon");

        Session.set('tool', "rect");
        rendered();
        canvas.drawCurve();
    },
    // Event Handler for Using eraser tool
    'click #rub': function(event) {
        console.log("inside #draw-eraser");

        $(".activeIcon").removeClass("activeIcon");
        $(event.target).addClass("activeIcon");

        Session.set('tool', "erase");
        rendered();
        canvas.drawCurve();
    }
});

// All the actions bind with ESC key
$(document).keyup(function(e) {

    if (e.keyCode == 27) {
        Session.set('draw', true);
        Session.set('tool', "pencil");

        $(".activeIcon").removeClass("activeIcon");
        $("#pan").addClass('activeIcon');

        temp = 0;
    }
});

// Reseting the position and scale of screenshot
function transformReset() {
    Session.set("zoomed", 1);
    $('#iframe_box').css({
        transform: 'matrix(1,0,0,1,0,0)',
        left: '0px',
        top: '27px'
    });
}

// The Mighty Canvas function
function Canvas() {
    var self = this;
    var svg;
    // appending svg to canvas
    svg = d3.select('svg');
    console.log("canvas() - svg:" + svg);

    var drawObj = {
            isDown: false,
            dataPoints: [],
            type: null,
            color: null,
            currentPath: null
    }

    // Adding multiple markers

    // d generator for line
    var line = d3.svg.line();

    // d generator for Rectangle
    function rightRoundedRect(x, radius) {
        return "M" + x[0][0] + "," + x[0][1] + "L" + x[0][0] + "," + x[1][1] + "L" + x[1][0] + "," + x[1][1] + "L" + x[1][0] + "," + x[0][1] + "L" + x[0][0] + "," + x[0][1] + "z";
    }

    // d generator for circle
    function circleGen(x, myr) {
        return "M" + x[0][0] + "," + x[0][1] + " " +
            "m" + -myr + ", 0 " +
            "a" + myr + "," + myr + " 0 1,0 " + myr * 2 + ",0 " +
            "a" + myr + "," + myr + " 0 1,0 " + -myr * 2 + ",0Z";
    }

    //ZoomIn iframe box
    self.zoomIn = function() {
            if (Session.get("zoomed") <= 2) {
                zoomed = Session.get("zoomed") + 0.2;
                $("#iframe_box").css({
                    transform: 'matrix(' + zoomed + ',0,0,' + zoomed + ',0,0)'
                });
                var unZoomed = 1/zoomed;

                Session.set('zoomed', zoomed);
            }
    }

    //ZoomOut iframe box
    self.zoomOut = function() {
        if (Session.get("zoomed") > 0.20000000000000007) {
            zoomed = Session.get("zoomed") - 0.2;
            $("#iframe_box").css({
                transform: 'matrix(' + zoomed + ',0,0,' + zoomed + ',0,0)'
            });
            var unZoomed = 1 / zoomed;

            Session.set('zoomed', zoomed);
        }
    }

    //1:1 iframe box
    self.extent = function() {
        transformReset();
    }

    // Clear all the comments
    self.clear = function() {
        $(".annote").remove();
    };

    // Storing all the annotations to db
    self.pathGrab = function(d, type, id) {

        var annotationData = {
            annotationD: d,
            annotationType: type,
            annotationId: new Meteor.Collection.ObjectID()._str,
            annotationColor: "green"
        }

        var sessionId = Session.get("sessionId");
        DrawSessions.update({'_id': sessionId}, {$push:{'annotations': annotationData}});
        $("#annotePre").remove();
    },

    // Deleting Annotations
    self.deleteAnnotation = function(id) {

        var sessionId = Session.get("sessionId");
        DrawSessions.update({'_id': sessionId}, {$pull: {'annotations': {'annotationId': id}}});

    }

    //To draw a curve
    self.drawCurve = function() {

        // mousedown
        svg.on("mousedown", function() {
            drawObj.isDown = true;

            //if the tool is Arrow
            if (Session.get("tool") == "arrow") {
                drawObj.dataPoints = [];
                drawObj.currentPath = null;
                var dataDot = d3.mouse(this);
                for (var i = 0; i < dataDot.length; i++) {
                    dataDot[i] = dataDot[i] / Session.get("zoomed");;
                };
                drawObj.dataPoints.push(dataDot);
            }

            if (Session.get("tool") == "rect") {
                drawObj.dataPoints = [];
                drawObj.currentPath = null;
                var dataDot = d3.mouse(this);
                for (var i = 0; i < dataDot.length; i++) {
                    dataDot[i] = dataDot[i] / Session.get("zoomed");
                };
                drawObj.dataPoints.push(dataDot);
            }
        });

        drawObj.isDown = false;
        drawObj.dataPoints = [];
        drawObj.currentPath = null;

        // mousemove
        svg.on("mousemove", function() {
            //Work only if tool is pencil
            if (Session.get("tool") == "pencil") {
                if (drawObj.isDown) {
                    //fetch all the coordinates while mouse moves and push in dataPoints array
                    var dataDot = d3.mouse(this);
                    for (var i = 0; i < dataDot.length; i++) {
                        dataDot[i] = dataDot[i] / Session.get("zoomed");
                    };
                    drawObj.dataPoints.push(dataDot);
                    //Check that is the path variable is already there or not
                    if (!drawObj.currentPath) {
                        drawObj.currentPath = svg.append("path")
                            .style("stroke-width", 2)
                            .attr("stroke", userColor)
                            .style("fill", "none")
                            .attr('id', 'annotePre')
                            .attr("class", "pencil annote");
                    }
                }
                if (drawObj.currentPath) {
                    drawObj.currentPath
                        .datum(drawObj.dataPoints)
                        .attr("d", line);
                }
            }
            //if the tool is arrow
            if (Session.get("tool") == "arrow") {
                if (drawObj.isDown) {
                    var dataDot = d3.mouse(this);
                    for (var i = 0; i < dataDot.length; i++) {
                        dataDot[i] = dataDot[i] / Session.get("zoomed");
                    };
                    drawObj.dataPoints.push(dataDot);
                    if (drawObj.currentPath) {
                        drawObj.currentPath.remove();
                    }
                    drawObj.currentPath = svg.append("path")
                        .datum(drawObj.dataPoints)
                        .attr("d", line)
                        .attr("stroke", userColor)
                        .attr("stroke-width", 2)
                        .attr("fill", "none")
                        .attr('id', 'annotePre')
                        .attr("class", "arrow annote");
                    drawObj.dataPoints.pop();
                }
            }

            // if tool is rect
            if (Session.get("tool") == "rect") {
                if (drawObj.isDown) {
                    var dataDot = d3.mouse(this);
                    for (var i = 0; i < dataDot.length; i++) {
                        dataDot[i] = dataDot[i] / Session.get("zoomed");
                    };
                    drawObj.dataPoints.push(dataDot);
                    if (drawObj.currentPath) {
                        drawObj.currentPath.remove();
                    }
                    drawObj.currentPath = svg.append("path")
                        .attr("d", rightRoundedRect(drawObj.dataPoints, 10))
                        .attr("stroke", userColor)
                        .attr("stroke-width", 2)
                        .attr("fill", "none")
                        .attr('id', 'annotePre')
                        .attr("class", "rect annote");
                    drawObj.dataPoints.pop();
                }
            }
        });

        // mouseup
        svg.on("mouseup", function() {
            //if tool is arrow
            if (Session.get("tool") == "arrow") {
                if (drawObj.currentPath) {
                    self.pathGrab(drawObj.currentPath.attr("d"),
                        drawObj.currentPath.attr('class'));
                }
                var lastPoint = d3.mouse(this);

                drawObj.isDown = false;
                drawObj.dataPoints = [];
                drawObj.currentPath = null;
            }
            //if tool is pencil
            if (Session.get("tool") == "pencil") {
                if (drawObj.currentPath) {
                    self.pathGrab(drawObj.currentPath.attr("d"),
                        drawObj.currentPath.attr('class'));
                }
                var lastPoint = d3.mouse(this);

                drawObj.isDown = false;
                drawObj.dataPoints = [];
                drawObj.currentPath = null;
            }
            // if tool is rect
            if (Session.get("tool") == "rect") {
                if (drawObj.currentPath) {
                    self.pathGrab(drawObj.currentPath.attr("d"),
                        drawObj.currentPath.attr('class'));

                }
                var lastPoint = d3.mouse(this);

                drawObj.isDown = false;
                drawObj.dataPoints = [];
                drawObj.currentPath = null;
            }
        });
    }
}

// Initializing Canvas
function rendered() {

    if(Session.get("tool")!="hide"){
        $('svg').show();
    }
    if (!canvasReady) {
        canvas = new Canvas();
        //$("#iframe_box").css('transform', 'matrix(1,0,0,1,0,0)');
        canvasReady = true;
    };
}

//Global Variables
var canvas;
var canvasReady = false;
var userColor;
var temp = 0;
var chat = false;
var userBar = false;
