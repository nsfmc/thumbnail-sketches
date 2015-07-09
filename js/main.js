/*global React document */

(function(){
  "use strict";

  // stolen from http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
  }

  // simple version of python range
  var range = function(count) {
    var acc = [];
    for(var i = 0; i < count; i += 1) { acc[i] = i; }
    return acc;
  };

  // stolen from underscore.js
  var shuffle = function(set) {
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = Math.floor(Math.random() * (index + 1));
      if (rand !== index) { shuffled[index] = shuffled[rand]; }
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  var StaticThumbBox = React.createClass({
    propTypes: {
      metadata: React.PropTypes.object
    },
    render: function() {
      var params = this.props.params;
      var meta = this.props.metadata;
      var bgimg = meta.img;

      var thumbStyle = {
        width: params.width,
        height: params.height,
        left: params.left,
        top: params.top,
        backgroundImage: "url(" + bgimg + ")"
      };

      return (
        <div className="thumb" style={thumbStyle} />
      );
    }
  });

  var ScrubbingThumb = React.createClass({
    propTypes: {
       metadata: React.PropTypes.object
    },

    getDefaultProps: function(){

    },
    getInitialState: function(){
      return {"hovering": -1};
    },

    render: function(){
      var params = this.props.params;
      var meta = this.props.metadata;
      var bgimg = meta.img;

      var thumbStyle = {
        width: params.width,
        height: params.height,
        left: params.left,
        top: params.top,
        backgroundImage: ("url(" + bgimg + ")")
      };
      if (this.state.hovering !== -1) {
        thumbStyle.backgroundImage = "url(" + + ")"
      }

      var cols = 5;
      var that = this;

      var colElts = range(cols).map(function(e, i){
        var colstyle = {
          width: (Math.floor(100 / cols) + "%"),
          display: "inline-block",
          height: "100%",
          backgroundColor: "#c0c",
          opacity: (that.state.hovering === i ? 1 : 0),

        };

        return <div style={colstyle} key={i + "col"} onMouseEnter={function(){ that.setState({"hovering": i}); }} />;
      });

      return (
        <div className="thumb" style={thumbStyle} onMouseLeave={function(){ that.setState({"hovering": -1}); }} >
          {colElts}
        </div>
      );
    }
  });

  var HoveringThumbBox = React.createClass({
    // TODO: not actually a generic thumbox, this is a hovering one
    propTypes: {
      params: React.PropTypes.object,
      metadata: React.PropTypes.object
    },

    onMouseEnter: function(){ this.setState({ hovering: true }); },
    onMouseLeave: function(){ this.setState({ hovering: false }); },
    getInitialState: function(){
      return { hovering: false };
    },

    render: function(){
      var params = this.props.params;
      var meta = this.props.metadata;
      var bgimg = this.state.hovering ? (meta.hover || meta.img) : meta.img;
      var thumbStyle = {
        width: params.width,
        height: params.height,
        left: params.left,
        top: params.top,
        backgroundImage: "url(" + bgimg + ")"
      };

      return (
        <div className="thumb" style={thumbStyle} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          <div className="title">{meta.shortTitle}</div>
          <div className="banner">
            <div className="timecode">15:42</div>
          </div>
        </div>
      );
    }
  });

  var ProtoFrame = React.createClass({
    propTypes: {
      details: React.PropTypes.object.isRequired,
      thumbMetadata: React.PropTypes.array.isRequired,
      thumbType: React.PropTypes.string.isRequired
    },

    render: function(){
      var proto = this.props.details;
      var protoStyle = {
        backgroundSize: "cover",
        backgroundImage: "url(" + proto.canvas + ")",
        height: proto.height,
        width: proto.width
      };

      var thumbnailType = this.props.thumbType;
      var meta = shuffle(this.props.thumbMetadata);
      var thumbs = proto.dimensions.map(function(e, i) {
        switch (thumbnailType) {
          case "static":
            return (<StaticThumbBox params={e} metadata={meta[i]} key={proto.canvas + i} />);
          case "scrub":
            return (<ScrubbingThumb params={e} metadata={meta[i]} key={proto.canvas + i} />);
          default:
            return (<HoveringThumbBox params={e} metadata={meta[i]} key={proto.canvas + i} />);
        }
      });

      return (
        <div style={protoStyle} className="protoContainer">
          {thumbs}
        </div>
      );
    }
  });

  // TODO this represents _just one_ kind of thumb in this frame
  var protoProps = [
    {
      canvas: "img/chrome/G2lH.png",
      width: 1388,
      height: 889,
      dimensions: [
        {
          width: 256, height: 144,
          top: 206, left: 544
        },
        {
          width: 256, height: 144,
          top: 395, left: 544
        },
        {
          width: 256, height: 144,
          top: 584, left: 544
        }
      ]
    },
    {
      canvas: "img/chrome/jlW3.png",
      width: 1388,
      height: 889,
      dimensions: [
        {
          width: 197, height: 111,
          top: 185, left: 330
        },
        {
          width: 197, height: 111,
          top: 314, left: 330
        },
        {
          width: 197, height: 111,
          top: 445, left: 330
        },
        {
          width: 197, height: 111,
          top: 705, left: 330
        }
      ]
    },
    {
      canvas: "img/chrome/HlbK.png",
      width: 1388,
      height: 889,
      dimensions: [
        {
          width: 197, height: 111,
          top: 207, left: 330
        },
        {
          width: 197, height: 111,
          top: 336, left: 330
        },
        {
          width: 197, height: 111,
          top: 467, left: 330
        }
      ]
    },
    {
      canvas: "img/chrome/ipUm.png",
      width: 1388,
      height: 889,
      dimensions: [
        {
          width: 1014, height: 447,
          top: 248, left: 327
        }
      ]
    }
  ];

  var metadata = [
    { shortTitle: "What is an algorithm?", img: "img/addition_1.png", hover: "img/addition_1.gif" },
    { shortTitle: "A guessing game", img: "img/addition_1.png", hover: "img/addition_1.gif" },
    { shortTitle: "Route-finding", img: "img/addition_1.png", hover: "img/addition_1.gif" },
    { shortTitle: "Get Started", img: "img/addition_1.png", hover: "img/addition_1.gif" }
  ];

  var box = document.getElementById("reactbox");
  var thumbType = getQueryVariable("thumbnailType") || "hover";
  var protoCanvas = getQueryVariable("proto") || 1;

  React.render(<ProtoFrame details={protoProps[protoCanvas]} thumbMetadata={metadata} thumbType={thumbType} />, box);
})();
