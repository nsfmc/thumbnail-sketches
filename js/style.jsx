/* global React Caman  */

// style.js -- style guide nonsense
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

// simple version of python range
var range = function(count) {
  var acc = [];
  for(var i = 0; i < count; i += 1) { acc[i] = i; }
  return acc;
};

var SearchThumb = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    image: React.PropTypes.string,
    branded: React.PropTypes.bool,
    titleProps: React.PropTypes.object,
    width: React.PropTypes.number
  },
  getDefaultProps: function(){
    return {
      domain: "math", branded: false,
      width: 160
    };
  },
  // subject colors
  render: function() {
    var containerStyle = {
      width: this.props.width,
      height: (this.props.width * 9 / 16),
      position: "relative",
    };

    var titleProps = this.props.titleProps || {};
    titleProps.width = titleProps.width || (.625 * this.props.width);
    titleProps.fontSize = titleProps.fontSize || (this.props.width / 160 * 13);
    titleProps.paddingLeft = titleProps.paddingLeft || ((this.props.width - titleProps.width) / 2);

    return (
      <div style={containerStyle} className="search-thumb">
        <TitleBox title={this.props.title} {...titleProps} />
        <DomainOverlay domain={this.props.domain} image={this.props.image} />
        {this.props.branded && <KAOverlay /> }
      </div>
    );
  }
});


var TitleBox = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    width: React.PropTypes.number,
    fontSize: React.PropTypes.number,
    paddingLeft: React.PropTypes.number
  },
  getDefaultProps: function(){
    return {width: 100, fontSize: 13, paddingLeft: 30, height: 90};
  },
  render: function(){
    var titleBoxStyle = {
      display: "table-cell",
      verticalAlign: "middle",
      width: this.props.width,
      height: this.props.height,
      paddingLeft: this.props.paddingLeft,
      textAlign: "center"
    };
    var titleStyle = {
      fontFamily: "proxima-nova-condensed", //TODO: uses typekit
      fontWeight: 600,
      fontSize: this.props.fontSize,
      lineHeight: (this.props.fontSize * 15 / 13) + "px",
      textTransform: "uppercase",
      color: "white"
    };

    return (
      <div style={titleBoxStyle}>
        <span style={titleStyle}>
          {this.props.title}
        </span>
      </div>
    );
  }
});

var KAOverlay = React.createClass({
  render: function(){
    var logoStyle = {
      fontFamily: "FontAwesome",
      fontSize: 10,
      position: "absolute",
      bottom: -1,
      left: 4,
      color: "white"
    };
    var leafStyle = {
      color: "#8dc63f",
      paddingRight: 1,
    };

    return (
      <div style={logoStyle}>
        <span style={leafStyle}>•</span
        ><span>KHANacademy</span>
      </div>
    );
  }
});

var DomainOverlay = React.createClass({
  propTypes: {
    domain: React.PropTypes.oneOf([
      "math", "science", "economics", "humanities", "test-prep", "cs", "partner-content", "default" ])
  },
  colors: {
    "math": "#58c4dd", // math topic
    "science": "#c55f73", // science topic
    "cs": "#76b056", // green 4
    "test-prep": "#b189c6", // purple 4
    "humanities": "#f16257", // red 5
    "default": "#46a592", // teal 4
    "partner-content": "#46a592", // teal 4
    "economics": "#d2923d" // econ topic
  },
  getInitialState: function(){
    return {imageData: false}
  },
  componentDidMount: function(){
    if (this.props.image) {
      var that = this;
      var overlay = React.findDOMNode(this.refs.overlayImg);
      Caman(overlay, function(){
        this.curves("rgb", [0, 80], [0, 80], [255, 170], [255, 170])
          .saturation(-15)
          .render(function(){
            that.setState({imageData: this.canvas.toDataURL()});
          });
      });

    }
  },
  render: function(){
    var overlayStyle = {
      backgroundColor: this.colors[this.props.domain],
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: -10,
      left: 0,
      top: 0,
      overflow: "hidden",
    };

    if (this.props.image){
      overlayStyle.backgroundSize = "cover";
      overlayStyle.backgroundPosition = "50% 50%";
      if (this.state.imageData) {
        overlayStyle.backgroundImage = "url(" + this.state.imageData + ")";
      }
      overlayStyle.backgroundBlendMode = "multiply, normal";

      var hiddenImage = {
        position: "absolute",
        top: -10000,
        left: -10000
      }
    }

    return (
      <div style={overlayStyle}>
        {!this.state.imageData && this.props.image && <img style={hiddenImage} ref="overlayImg" src={this.props.image} /> }
      </div>
    );
  }
});

// first set the whole line at the optimal size, measure text.
// if the whole line is too long, break in two at
// 55% or so. measure the resultant parent block.

var StyleGuide = React.createClass({

  render: function(){
    var domains = ["math", "science", "cs", "test-prep", "humanities", "default", "partner-content", "economics"];
    return (

      <article>
        <h1>Thumbnail Style Guide</h1>
        <section>
          <p>This is the style guide for video thumbnails, it talks a bit about how we got here
          and also some recommendations for people implementing the thumbnails.</p>
          <p>This is a basic thumbnail:</p>
          {shuffle(domains).map(function(e){
            var phrase = "some very long title taking three lines";
            var rearranged = shuffle(phrase.split(" ")).join(" ");
            return (
            <div style={{display: "inline-block", margin: 1 }}>
              <SearchThumb title={rearranged} domain={e} />
            </div>
          ); })}

          <p>We also have thumbnails that we present externally in spots like google search results or on youtube.
           they look like this.</p>
           {shuffle(domains).map(function(e){
             var phrase = "there all is aching";
             var rearranged = shuffle(phrase.split(" ")).join(" ");

             return (
             <div style={{display: "inline-block", margin: 1 }}>
               <SearchThumb title={rearranged} branded domain={e} />
             </div>
           ); })}

           <p>We can also support a thumbnail with an image (this is <em>actually</em> the default).</p>
           {shuffle(domains).map(function(e){
             var phrase = "there all is aching";
             var rearranged = shuffle(phrase.split(" ")).join(" ");
             var imagePrefix = "img/arthistorythumbs/arthistory";
             var imageSuffix = shuffle([".jpeg", "-1.jpeg", "-2.jpeg", "-3.jpeg"])[0];
             return (
             <div style={{display: "inline-block", margin: 1 }}>
               <SearchThumb title={rearranged} branded domain={e} image={imagePrefix + imageSuffix}/>
             </div>
           ); })}
           <p>For the images, we desaturate them 15% and then adjust their curves so that they fall
           mostly in a grey zone of lightness. the curve here is just two points: <code>[0, 80], [255, 170]</code>
           and the color itself is mixed with the image using the <em>multiply</em> blend mode.</p>
           <p>For all videos, <b>the above is exactly what gets sent to youtube</b>, but at 1280x720, they overlay
           a timecode on the bottom right of all videos.</p>

           <p>On the site and mobile devices, because we have metadata available and better text rendering at native
           point sizes, for search results, we may omit the force-burned text and istead have just the saturated
           image, as below, opting to add titles or content icons as needed.</p>
           {shuffle([".jpeg", "-1.jpeg", "-2.jpeg", "-3.jpeg", "-4.jpeg", "-5.jpeg", "-6.jpeg", ".png", "-1.png"]).slice(0, 8).map(function(suffix){
             var imagePrefix = "img/maththumbs/math";
             return (
             <div style={{display: "inline-block", margin: 1 }}>
               <SearchThumb domain="math" image={imagePrefix + suffix}/>
             </div>
           ); })}



           <h2>Colors</h2>
           <p>the thumbnails <em>mostly</em> use topic colors for a given domain. Currently, they're given as:</p>
           <ul>
            <li>economics: <code>#d2923d</code> // econ topic</li>
            <li>math: <code>#58c4dd</code>, // math topic </li>
            <li>science: <code>#c55f73</code>, // science topic </li>
            <li>cs: <code>#76b056</code>, // green 4 </li>
            <li>test-prep: <code>#b189c6</code>, // purple 4 </li>
            <li>humanities: <code>#f16257</code>, // red 5 </li>
            <li>default: <code>#46a592</code>, // teal 4 </li>
            <li>partner-content: <code>#46a592</code>, // teal 4 </li>
          </ul>

           <h2>Type</h2>
           <p>In general, for a 160x90 thumbnail, the type is <strong>Proxima Nove Condensed - Semibold </strong>
           set at 13px with 15px leading, but you can vary
           the font size as needed, the leading will update. if you need to break a tough line, you can adjust the
           title's width. The visual look should always be a mostly justified but centered block occupying ~63% of the
           width of the box +- some fuzzing</p>
           <p>The title of these text boxes will show you how thes properties vary for a give run of text</p>
           <div style={{display: "inline-block", margin: 1}} title="titleProps={{fontSize: 14, width: 110}}">
             <SearchThumb domain="math"
              title="i left my heart in san francisco" titleProps={{fontSize: 14, width: 110}} />
           </div>
           <div style={{display: "inline-block", margin: 1}} title="titleProps={{fontSize: 19, width: 110}}">
             <SearchThumb domain="science" title="Red Balloon" titleProps={{fontSize: 19, width: 110}} />
           </div>
           <div style={{display: "inline-block", margin: 1}} title="titleProps={{fontSize: 12, width: 110}}">
             <SearchThumb domain="cs" title="Weekly topics in linear algebra (affine transforms)" titleProps={{fontSize: 12, width: 110}} />
           </div>

           <h2>Thumb Sizes</h2>
           <p>Although all the thumbs here have been 160 &times; 90, thumbnails exist in <a href="https://app.asana.com/0/36838877178178/37010952767376">a variety of sizes</a> in
           the world, not to mention our site.</p>
           <p>For simplicity, we generate a 1280 &times; 720 (<em>720p</em>) that we send to youtube, but we also support on tutorial pages, thumbnails of size 256 &times; 144</p>

           <div style={{display: "inline-block", margin: 1}}>
             <SearchThumb
              domain="humanities" title="Man with red hat" image="img/turban.jpeg"
              width={256} />
           </div>

           <h2>Content Annotations</h2>

           <h2>Video Poster Frames</h2>

        </section>
      </article>

    );
  }
});
                      // TODO(): articles - words/mins/pages
                      // TODO(): exercises - dots/star
                      // TODO(): poster frame for video
                      // TODO(): final dimensions
                      // TODO(): example of thumbs in context
