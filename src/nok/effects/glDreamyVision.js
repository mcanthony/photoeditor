/**
 * WebGL "Dreamy Vision" effect.
 *
 * @author Tomi Aarnio
 */

goog.require('nokia.gl');
goog.require('nokia.utils');
goog.require('nokia.Effect');
goog.require('nokia.EffectManager');

goog.provide('nokia.effect.glDreamyVision');

(function($, nokia) {

  // ====================
  // = Global variables =
  // ====================

  var self;

  // ===============
  // = Constructor =
  // ===============

  /**
   * Effect constructor, called upon entering the 'Effects'
   * menu.  At this point, the image to be edited is already
   * known.
   */
  nokia.effect.glDreamyVision = function () {
    nokia.Effect.call(this);
    self = this;
    console.log('glDreamyVision constructor.');
  };
  goog.inherits(nokia.effect.glDreamyVision, nokia.Effect);

  /**
   * Effect initializer, called upon selecting the effect on
   * the 'Effects' menu.  At this point, we need to set up any
   * menu items other than 'Undo', 'Apply' and 'Cancel' which
   * are provided by the Effect base class.  This is also a good
   * opportunity to do full-frame preprocessing on the source
   * image.
   */
  nokia.effect.glDreamyVision.prototype.init = function() {

    console.log("glDreamyVision init");

    var fuzzinessButton = $.getMenu().addSliderAttribute('Fuzziness', {
      min:0,
      max:1,
      value:1,
      step:0.01,
      slide: function (evt, ui) {
        nokia.effect.glDreamyVision.preprocess(nokia.gl.context, ui.value);
		    nokia.Effect.glPaint();
      }
    });

    // Preprocessing: Preprocessed image goes to
    // nokia.gl.textureFiltered a.k.a. "filtered".

    self.glShaderDreamyVision = nokia.gl.setupShaderProgram(nokia.gl.context, "dreamyvision");
    nokia.effect.glDreamyVision.preprocess(nokia.gl.context, 1.0);
    nokia.Effect.glPaint();

    // Bring up the Fuzziness slider to give a hint to the user

    fuzzinessButton.click();
  };

  /**
   * uninit
   */

  nokia.effect.glDreamyVision.prototype.uninit = function() {
	  console.log("glDreamyVision uninit");
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  // WebGL drawing code
  //

  nokia.effect.glDreamyVision.preprocess = function (gl, alpha) {
    console.log("nokia.effect.glDreamyVision.preprocess");

	  var uniforms = { "resolution" : [nokia.gl.width, nokia.gl.height], 
		                 "alpha"      : alpha,
		                 "src"        : nokia.gl.textureOriginal };

	  nokia.gl.renderToTexture(gl, nokia.gl.textureFiltered, self.glShaderDreamyVision, uniforms);
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  // Effect registration
  //
  nokia.EffectManager.register('Dreamy Vision', nokia.effect.glDreamyVision);

})(jQuery, nokia);