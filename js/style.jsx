/* global React Caman  */

// style.js -- style guide nonsense
"use strict";

// stolen from mdn
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}


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

var SimpleThumb = React.createClass({
  propTypes: {
    image: React.PropTypes.string,
    width: React.PropTypes.number
  },
  getDefaultProps: function(){
    return {
      branded: false,
      width: 160};
  },
  render: function(){
    var containerStyle = {
      width: this.props.width,
      height: (this.props.width * 9 / 16),
      position: "relative",
      backgroundImage: "url(" + this.props.image +")",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      borderRadius: "2.5px",
      backgroundClip: "padding-box",
      overflow: "hidden"
    };
    var titleProps = this.props.titleProps || {};
    titleProps.width = titleProps.width || (.625 * this.props.width);
    titleProps.height = titleProps.height || containerStyle.height;
    titleProps.fontSize = titleProps.fontSize || (this.props.width / 160 * 13);
    titleProps.paddingLeft = titleProps.paddingLeft || ((this.props.width - titleProps.width) / 2);

    return (
      <div style={containerStyle} className="search-thumb">
        <TitleBox title={this.props.title} {...titleProps} />
        {this.props.branded && <KAOverlay /> }
      </div>
    );

  }
});

var FuzzyThumb = React.createClass({
  propTypes: {
    image: React.PropTypes.string,
    width: React.PropTypes.number,
    buttonSize: React.PropTypes.number,
    domain: React.PropTypes.oneOf([
      "math", "science", "economics", "humanities", "test-prep", "cs", "partner-content", "default" ])
  },
  getDefaultProps: function(){
    return {
      branded: false,
      width: 160
    };
  },
  colors: {
    "math": "#29abca", // math 2 subject
    "science": "#c55f73", // science topic
    "cs": "#76b056", // green 4
    "test-prep": "#b189c6", // purple 4
    "humanities": "#c13b32", // red 2
    "default": "#46a592", // teal 4
    "partner-content": "#46a592", // teal 4
    "economics": "#d2923d" // econ topic
  },
  render: function(){
    var buttonSize = this.props.buttonSize || this.props.width * .2;
    var containerStyle = {
      width: this.props.width,
      height: (this.props.width * 9 / 16),
      position: "relative",
      backgroundImage: "url(" + this.props.image + ")",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      borderRadius: "2.5px",
      backgroundClip: "padding-box",
      overflow: "hidden"
    };
    var offsetLeft = (this.props.width - buttonSize) / 2;
    var offsetTop = (containerStyle.height - buttonSize) / 2;

    var clipStyle = {
      width: buttonSize,
      height: buttonSize,
      borderRadius: "100%",
      overflow: "hidden",
      transform: "translate(" + offsetLeft + "px, " + offsetTop + "px)",
    };
    var blur = {
      width: containerStyle.width,
      height: containerStyle.height,
      backgroundImage: "url(" + this.props.image + ")",
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
      transform: "translate(" + (-1 * offsetLeft) + "px, " + (-1 * offsetTop) + "px)",
      WebkitFilter: "blur(5px)",
    };
    var overlay = {
      width: "100%",
      height: "100%",
      opacity: 0.6
    };

    if (this.props.domain) {

      overlay.backgroundBlendMode = "overlay, normal";
      overlay.backgroundColor = this.colors[this.props.domain];
    }

    return (
      <div style={containerStyle}>
        <div style={clipStyle}>
          <div style={blur}>
            <div style={overlay}></div>
          </div>
        </div>
      </div>
    );
  }
});

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
      borderRadius: "2.5px",
      backgroundClip: "padding-box",
      overflow: "hidden"
    };

    var titleProps = this.props.titleProps || {};
    titleProps.width = titleProps.width || (.625 * this.props.width);
    titleProps.height = titleProps.height || containerStyle.height;
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
    height: React.PropTypes.number,
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
    return {imageData: false};
  },
  renderImage: function(){
    // only attempt rendering image if no imageData exists and
    // if an image was sent to this component
    if (this.props.image && !this.state.imageData) {
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
  componentDidMount: function(){
    // render after the img has been loaded once
    this.renderImage();
  },
  componentWillReceiveProps: function() {
    this.setState({"imageData": false});
  },
  componentDidUpdate: function(){
    // attempt rerendering image data if we get an update
    this.renderImage();
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
        {!this.state.imageData &&
          this.props.image && <img style={hiddenImage} ref="overlayImg" src={this.props.image} /> }
      </div>
    );
  }
});

var ManyOf = React.createClass({
  propTypes: {
    randomString: React.PropTypes.string,
    count: React.PropTypes.number,
    type: React.PropTypes.string,
    childProps: React.PropTypes.object,
    spin: React.PropTypes.array // keys in childProps to shuffle on each instance
  },
  spinProps: function(){
    // randomize props marked in the spin array
    var shuffledProps = {};
    if (this.props.spin) {
      for (var i = 0; i < this.props.spin.length; i += 1){
        var key = this.props.spin[i];
        shuffledProps[key] = [];
        while (shuffledProps[key].length < this.props.count){
          // if you have less choices than number of iterations, then
          // continue to add shuffled versions of those choices so that
          // the every n are pleasantly random
          shuffledProps[key] = shuffledProps[key].concat(shuffle(this.props.childProps[key]));
        }
      }
    }
    return shuffledProps;
  },
  rerender: function(){
    this.forceUpdate(function(){console.log('huh')});
  },
  render: function(){
    var containerStyle = {display: "inline-block", margin: 1 };
    var total = this.props.count;
    var that = this;
    var passThroughProps = Object.assign({}, this.props.childProps || {});
    var shuffledProps = this.spinProps();

    var components = range(total).map(function(el, idx, arr) {
      if (that.props.randomString) {
        passThroughProps.title = shuffle(that.props.randomString.split(" ")).join(" ");
      }

      if (that.props.spin) {
        // cycle through the spun child props
        for (var i = 0; i < that.props.spin.length; i += 1){
          var key = that.props.spin[i];
          passThroughProps[key] = shuffledProps[key][idx % shuffledProps[key].length];
        }
      }
      return (
        <div style={containerStyle} >
          {React.createElement(window[that.props.type], passThroughProps)}
        </div>
      );
    });

    return (
      <div>
        {components}
        <br /><button onClick={this.rerender}>shuffle!</button>
      </div>
    );
  }
});

var TigerBeatQuiz = React.createClass({
  // a simple yep/nope tigerbeat-style quiz
  propTypes: {
    questions: React.PropTypes.array,
    // expect ["you enjoyed the green lantern",
    //         "you can tolerate ryan reynolds", ...]
    thresholds: React.PropTypes.array
    // [ [0, "you will be doomed to an eternity with sinestro"],
    //   [3, "you might go on a ridealong with green lantern"],
    //   [5, "you will star in a buddy cop procedural with kilowog"]];
  },
  getInitialState: function(){
    return {tally: 0};
  },
  respond: function(evt){
    var amount = evt.target.checked ? 1 : -1;
    this.setState({tally: (this.state.tally + amount) });
  },
  getMax: function(){
    var sorted = this.props.thresholds.sort(function(a, b){return a[0]-b[0]});
    var output = false;
    var i = 0; // zzzzzomg gross
    while (i < sorted.length && this.state.tally >= sorted[i][0]){
      i += 1;
    }
    if (i > 0) { output = sorted[i - 1]}

    return output;
  },
  render: function(){
    var score = this.getMax();
    var ulStyle = {paddingLeft: 0};
    var liStyle = {listStyleType: "none", fontFamily: "proxima-nova-condensed", fontSize: "13px"};
    var resultStyle = {borderTop: "1px solid #ddd" ,fontFamily: "proxima-nova-condensed", fontSize: "12px", marginLeft: "10"};
    if (score[2]) { resultStyle.color = score[2]; };
    var that = this;
    return (
      <div style={{borderLeft: "2px solid #ddd", paddingLeft: "5px", marginLeft: "2px"}}>
      <ul style={ulStyle}>
        {this.props.questions.map(function(el, idx){
          return (
            <li key={idx + el.slice(0,5)} style={liStyle}>
              <label><input onChange={that.respond} type="checkbox" />{el}</label>
            </li>
          );
        })}
      </ul>
      <p style={resultStyle}>&#9758; {score[1] || ""}</p>
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
          <p>This is the style guide for video thumbnails, it talks a bit about how we got here, a bit about how
          you can design and choose successful copy/images for your thumbs as well as
          recommendations for people implementing the thumbnails.</p>

          <h2>Choosing Images</h2>
          <p>Before we treat a thumbnail, the image you choose should stand on its own. The image should
          be captivating and, if possible, representative of the video/exercise/article/etc's content.</p>

          <p>How will you know if it meets these bars? Here's an easy checklist for you:</p>
          <TigerBeatQuiz questions={[
            "it has a single focal point",
            "it is legible at 160 × 90px",
            "it might plausibly be recognize by a student not familiar with the topic",
            "if a diagram, possibly language agnostic",
            "can be disambiguated from its siblings in the same tutorial",
            "if photo, has a pleasing dynamic range (not too grey, not too bright)",
            ]}
            thresholds={[
              [0, "your thumbnail probably needs work", "#722"],
              [3, "maybe good enough? ask a friend!"],
              [5, "shipit!"]]}
          />

          <p>But because a checklist can be something of an inexact science, let's look at some images for context.</p>

          <div style={{display: "inline-block", margin: 1}}>
            <SimpleThumb image="img/blank-descartes.png" />
          </div>
          <p>Does this image of descartes qualify?</p>
          <p>Well, if the video is about Rene Descartes, then yes! It has a single focal point (his eyes/face),
          it is legible at 160 &times; 90,
          it could be identified as "somebody from the past" by a student unfamiliar with descartes,
          it is 100% language agnostic, presumably the adjacent videos are not about him directly,
          and as a photo, it has a pleasing dynamic range (his hair is nearly black, his forehead is nearly white, much
            of the image is somewhere between that).</p>
          <p>It's worth saying that simply choosing a dominant subject is not what is likely to make a good thumb.
          For example, on the left, you'll see a dominant subject, a good dynamic range but <em>absolutely zero context. </em>
          On the right, we have something better, assuming this is a video about, say looking at rothkos and <em>not</em> a
          video about the unexpected post-war rise of converse chuck taylors.</p>
          <div style={{display: "inline-block", margin: 1}}>
            <SimpleThumb image="img/badthumb.png" title="not so good"/>
          </div>
          <div style={{display: "inline-block", margin: 1}}>
            <SimpleThumb image="img/betterthumb.png" title="getting there!"/>
          </div>
          <p>And even then, it's worth asking: <em>is this as good as it can get?</em></p>

          <p>Behold this simple thumbnail, a screenshot of the video
            <a href="https://www.khanacademy.org/math/algebra2/functions_and_graphs/function-introduction/v/what-is-a-function">what is a function</a>.
          As a thumbnail, it conveys one of the core statements from the video:
            <em> input&nbsp;&rarr;&nbsp;function&nbsp;&rarr;&nbsp;output</em>
          </p>
          <SimpleThumb image="img/func-meh.png" />
          <p>According to the checklist above, it should be pretty good to go, right? But again, ask yourself: <em>could it be better?</em></p>
          <SimpleThumb image="img/func-good.png" />
          <p>This thumbnail's focus is unambiguous, the meaning is 100% clear and yet it is a graphic that never once appears in the video.
          Its colors have been saturated slightly and the diagram has itself been modified to maximally fit within the 16 &times; 9 ratio of
          the thumbnails. Is it an accurate image of what's in the video? no. but is it a better image? i argue yes.</p>

          <p><strong>Thumbnails should communicate as much as possible to a student just getting started on a topic.</strong></p>

          <h2>Picking titles</h2>
          <p>The space avalaible to you, the content creator, when choosing a thumbnail, is quite constrained.
          At best, you are likely to have three lines of ~16 characters available to you when choosing a thumbnail.
          This corresponds roughly to three lines of three moderate sized words.</p>
          <div style={{display: "inline-block", margin: 1}}>
            <SearchThumb image="img/func-good.png" domain="math" titleProps={{fontSize: 16}} title="what is a function?" />
          </div>
          <div style={{display: "inline-block", margin: 1}}>
            <SearchThumb image="img/func-good.png" domain="math" titleProps={{}} title="an intro to functions in algebra" />
          </div>
          <div style={{display: "inline-block", margin: 1}}>
            <SearchThumb image="img/func-good.png" domain="math" titleProps={{}} title="getting started with algebraic functions" />
          </div>
          <p>However as you think about your videos, don't simply try to maximize the number of words you cram into the
          thumbnail. Ask yourself how brief you can be, what of the video's title needs to remain, which articles are
          excessive, which clauses are simply not needed. </p>
          <p>Learners will look at this title, as brief as it is, for guidance and its wording will strongly influence how
          easily a video is discovered both on our site and externally.

          <h2>Thumbnail Specs</h2>

          <p>This is a basic thumbnail with 16 &times; 9 proportion and a slight 2.5px border radius. If we had
          no images at all, this is what you'd see before we had generated a thumbnail.</p>

          <ManyOf type="SearchThumb" count={8}
            randomString="some very long title taking three lines"
            childProps={{domain: domains}}
            spin={['domain']}
            />

          <p>We also have thumbnails that we present externally in spots like google search results or on youtube.
           they look like this.</p>
           <ManyOf type="SearchThumb" count={8}
             randomString="an upsetting number of pancakes"
             childProps={{domain: domains, branded: true}}
             spin={['domain']}
             />

           <p>We can also support a thumbnail with an image (this is <em>actually</em> the default).</p>
           <ManyOf type="SearchThumb" count={8}
             randomString="there all is aching"
             childProps={{
              domain: domains,
              branded: true,
              image: [".jpeg", "-1.jpeg", "-2.jpeg", "-3.jpeg"].map(function(e){
                return "img/arthistorythumbs/arthistory" + e; })
              }}
             spin={["domain", "image"]}
             />

           <p>For the images, we desaturate them 15% and then adjust their curves so that they fall
           mostly in a grey zone of lightness. the curve here is just two points: <code>[0, 80], [255, 170]</code>
           and the color itself is mixed with the image using the <em>multiply</em> blend mode.</p>
           <p>For all videos, <b>the above is exactly what gets sent to youtube</b>, but at 1280x720, they overlay
           a timecode on the bottom right of all videos.</p>

           <p>On the site and mobile devices, because we have metadata available and better text rendering at native
           point sizes, for search results, we may omit the force-burned text and istead have just the saturated
           image, as below, opting to add titles or content icons as needed.</p>
           <ManyOf type="SearchThumb" count={8}
             childProps={{
              domain: "math",
              image: [".jpeg", "-1.jpeg", "-2.jpeg", "-3.jpeg", "-4.jpeg", "-5.jpeg", "-6.jpeg", ".png", "-1.png"].map(function(e){
                return "img/maththumbs/math" + e; })
              }}
             spin={["image"]}
             />

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
              domain="humanities" title="Man w/ red turban" image="img/turban.jpeg"
              branded width={512} />
           </div>
           <div style={{display: "inline-block", margin: 1}}>
             <SearchThumb
              domain="humanities" title="Man w/ red turban" image="img/turban.jpeg"
              width={256} />
           </div>

           <h2>Content Annotations</h2>
           <p>Need to fill in the myriad possibilities of how thumbs may be annotated with their content types.</p>
           <div style={{display: "inline-block", margin: 1}}>
             <SearchThumb
              domain="humanities" title="Man w/ red turban" image="img/turban.jpeg"
              width={256} />
           </div>

           <h2>Video Poster Frames</h2>
           <p>The poster design for videos looks like this. On the left, we have a composed thumbnail using a
           fontawesome icon and on the right we have the bare image.</p>
           <div style={{display: "inline-block", margin: 1}}>
             <SimpleThumb image="img/descartes.png" />
           </div>
           <div style={{display: "inline-block", margin: 1}}>
           <SimpleThumb image="img/blank-descartes.png" />
           </div>
           <div style={{display: "inline-block", margin: 1}}>
           <FuzzyThumb image="img/blank-descartes.png" />
           </div>
           <div style={{display: "inline-block", margin: 1}}>
           <FuzzyThumb image="img/blank-descartes.png" domain="math" />
           </div>

          <div style={{display: "inline-block", margin: 1}}>
            <SimpleThumb image="img/turban.jpeg" />
          </div>
          <div style={{display: "inline-block", margin: 1}}>
            <FuzzyThumb image="img/turban.jpeg" />
          </div>
          <div style={{display: "inline-block", margin: 1}}>
            <FuzzyThumb image="img/turban.jpeg" domain="humanities" />
          </div>
          <div style={{display: "inline-block", margin: 1}}>
            <SearchThumb image="img/turban.jpeg" domain="humanities" />
          </div>
        </section>
      </article>

    );
  }
});
// TODO(articles)
// TODO(exercises)
// TODO(thumbs in context)
