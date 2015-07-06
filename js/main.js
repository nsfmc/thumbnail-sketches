(function(){
  "use strict";

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

  var ThumbBox = React.createClass({
    render: function(){
      var params = this.props.params;
      var meta = this.props.metadata;
      var thumbStyle = {
        width: params.width,
        height: params.height,
        left: params.left,
        top: params.top,
        backgroundImage: "url(" + meta.img + ")"
      };
      var title = params.title;

      return (
        <div className="thumb" style={thumbStyle}>
          <div className="title">{title}</div>
          <div className="banner">
            <div className="timecode">15:42</div>
          </div>
        </div>
      );
    }
  });

  var ProtoFrame = React.createClass({
    render: function(){
      var proto = this.props.details;
      var protoStyle = {
        backgroundSize: "cover",
        backgroundImage: "url(" + proto.canvas + ")",
        height: proto.height,
        width: proto.width
      };


      var meta = shuffle(this.props.thumbMetadata);
      var thumbs = proto.dimensions.map(function(e, i) {
        return (<ThumbBox params={e} metadata={meta[i]} key={proto.canvas + i} />);
      });

      return (
        <div style={protoStyle} className="protoContainer">
          {thumbs}
        </div>
      );
    }
  });

  // TODO this represents _just one_ kind of thumb in this frame
  var protoProps = {
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
  };

  var metadata = [
    { title: "What is an algorithm?", img: "img/addition_1.png" },
    { title: "A guessing game", img: "img/addition_1.png" },
    { title: "Route-finding", img: "img/addition_1.png" }
  ];

  var box = document.getElementById("reactbox");
  React.render(<ProtoFrame details={protoProps} thumbMetadata={metadata} />, box);
})();
