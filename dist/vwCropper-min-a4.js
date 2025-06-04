var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __Pf = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __Pg = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __Pa = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __Pm = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _Cropper_instances, reset_fn, _stringList;
const types = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
class main {
  constructor() {
    __Pf(this, "_strings");
    __Pf(this, "_settings");
    __Pf(this, "_eventBus");
    this._strings = new Strings();
    this._settings = new Settings();
    this._eventBus = new EventBus(this);
  }
  get strings() {
    return this._strings;
  }
  get settings() {
    return this._settings;
  }
  get eventBus() {
    return this._eventBus;
  }
  /** Register a listener for an event */
  on(eventName, fn) {
    return this.eventBus.registerListener(eventName, fn);
  }
  /** Remove a listener for an event */
  off(eventName) {
    return this.eventBus.clearListeners(eventName);
  }
}
const _Cropper = class _Cropper extends main {
  constructor(config) {
    const mn = "cropper.constructor";
    Logger.log(mn, "Starts", arguments);
    super();
    __Pa(this, _Cropper_instances);
    __Pf(this, "sizeBox", new Konva.Rect({
      listening: false,
      visible: false,
      stroke: "gold",
      strokeWidth: 2
    }));
    // private shapeMode: 'image' | 'path' = 'image'
    /** Dedicated layer for cropping. We use this to isolate the cropping process from the rest of the shapes */
    __Pf(this, "croppingLayer");
    /** The transformer containing the target image, if target imgage has a transformer */
    __Pf(this, "targetTransformer");
    /** The nodes that are in the target transformer - we note these and reset them when done */
    __Pf(this, "targetTransformerNodes", []);
    /** Note the listening state of the node so we can restore it when done */
    __Pf(this, "nodeListening", false);
    /** We need a full-sized version of the target image - we use this to apply the cropping */
    __Pf(this, "fullImage");
    /** The image is what we see in the bottom transformer */
    __Pf(this, "bottomImage");
    /** The image we see in the top transformer - we make a crop rect from this rects position and size. */
    // private topPath: Konva.Path | undefined;
    __Pf(this, "topPath");
    __Pf(this, "proxyRect");
    // /** The current position and size of the proxyRect before transform */
    // private proxyInfoBefore: {x: number, y: number, width: number, height: number} | undefined;
    // /** The current position and size of the shape before transform */
    // private shapeInfoBefore: {x: number, y: number, width: number, height: number} | undefined;
    // /** The current position and size of the shape after transform */
    // private shapeInfoAfter: {x: number, y: number, width: number, height: number} | undefined;
    // /** Position and size after transform */
    // private proxyInfoAfter: {x: number, y: number, width: number, height: number} | undefined;
    /** Aspect ratio of the target image */
    __Pf(this, "aspectRatio", 1);
    /** The transformer for the bottomImage */
    __Pf(this, "bottomTransformer");
    /** The transformer for the topImage */
    __Pf(this, "topTransformer");
    // The Konva.Rect acting as the overlay
    __Pf(this, "overlay");
    /** Default configuration for the cropper */
    __Pf(this, "defaultConfigs", {
      setup: {
        lic: ""
      },
      init: {
        path: void 0,
        initialWrap: true,
        initialWrapMarginPC: 10,
        keepRatio: false,
        flipEnabled: false,
        useOverlay: true,
        overlayClickAction: "Complete",
        overlayFill: "black",
        overlayOpacity: 0.3,
        outerAnchorPadding: 0,
        outerAnchorSize: 20,
        outerAnchorRadius: 10,
        outerAnchorStroke: "blue",
        outerAnchorFill: "white",
        innerAnchorPadding: 0,
        innerAnchorRadius: 0,
        innerAnchorSize: 10,
        innerAnchorStroke: "blue",
        innerAnchorFill: "white",
        callbacks: {}
      }
    });
    // /** The active configuration for the cropper */
    // private config = ns.Utility.JSONCopy(this.defaultConfig);
    __Pf(this, "anchorPos", { x: 0, y: 0 });
    __Pf(this, "lastAnchorPos", { x: 0, y: 0 });
    this.settings.setDefaults(this.defaultConfigs);
    this.settings.create("create", config);
  }
  get config() {
    return this.settings.getConfig("init");
  }
  /**
   * Initialisation method to inform cropper about the image being cropped.
   * 
   * @param initConfig - The configuration object containing the image to be cropped.
   */
  init(initConfig) {
    const mn = "cropper.init";
    Logger.log(mn, "Starts", arguments);
    if (!this.settings.b747) {
      return;
    }
    this.settings.create("init", initConfig);
    if (!this.config.path) {
      Logger.log(mn, "Dev error: No node defined");
      return;
    }
    this.settings.callbacks = this.config.callbacks;
    const image = this.config.path.fillPatternImage();
    if (!this.fullImage) {
      this.fullImage = new Konva.Image({
        image
      });
    } else {
      this.fullImage.image(image);
    }
    this.targetTransformer = Utility.findTransformerForNode(this.config.path);
    if (this.targetTransformer) {
      Logger.log(mn, "manage transfomer");
      this.targetTransformerNodes = this.targetTransformer.nodes();
      this.targetTransformer.nodes([]);
    }
    this.nodeListening = this.config.path.listening();
    Logger.log(mn, "Node.listening saved = " + this.nodeListening);
    this.config.path.listening(false);
    this.config.path.show();
    this.show();
    Logger.log(mn, "Ends");
  }
  /**
   *  Method to show the cropper feature for the image. The config was set in the setImage method above.
   *  
   * We will find the top layer and create on it our little cropping group  The image will be positioned directly on top of the 
   * image that is being cropped.  When we are done we will grab the cropped area and put that back into the original image - likely by 
   * manipulating the background offset thing.
   */
  show() {
    var _a;
    const mn = "cropper.show";
    Logger.log(mn, "Starts", arguments);
    if (!this.config.path) {
      Logger.log(mn, "Error: No shape defined - did you call cropper.init({image: myImage, ...}) ?");
      return;
    }
    this.config.path.show();
    const shapeLayer = this.config.path.getLayer(), image = this.fullImage.image(), stage = shapeLayer.getStage();
    this.aspectRatio = image.naturalWidth / image.naturalHeight;
    Logger.log(mn, "Image for " + this.config.path.getClassName(), image);
    if (!this.croppingLayer) {
      let croppingLayer = stage.findOne("._vw_croppingLayer");
      if (!croppingLayer) {
        croppingLayer = new Konva.Layer({
          name: "_vw_croppingLayer"
        });
        stage.add(croppingLayer);
      }
      this.croppingLayer = croppingLayer;
    }
    this.croppingLayer.moveToTop();
    this.croppingLayer.setAttrs(shapeLayer.getTransform().decompose());
    this.croppingLayer.show();
    if (this.config.useOverlay) {
      const overlayRect = Utility.getLayerRect(this.config.path.getLayer());
      Logger.log(mn, "Overlay rect", overlayRect);
      if (!this.overlay) {
        this.overlay = new Konva.Rect({});
      }
      this.croppingLayer.add(this.overlay);
      this.overlay.position(overlayRect);
      this.overlay.size(overlayRect);
      (_a = this.overlay) == null ? void 0 : _a.setAttrs({
        fill: this.config.overlayFill,
        opacity: this.config.overlayOpacity
      });
    }
    if (!this.bottomTransformer) {
      this.bottomTransformer = new Konva.Transformer({
        enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
        anchorStroke: this.config.outerAnchorStroke,
        anchorFill: this.config.outerAnchorFill,
        anchorSize: this.config.outerAnchorSize,
        anchorCornerRadius: this.config.outerAnchorRadius,
        padding: this.config.outerAnchorPadding,
        keepRatio: true,
        flipEnabled: false,
        rotateEnabled: false
      });
    }
    if (!this.bottomImage) {
      this.bottomImage = new Konva.Image({
        x: 0,
        y: 0,
        image: void 0,
        opacity: 0.2,
        listening: true,
        draggable: true
      });
    }
    if (!this.topTransformer) {
      this.topTransformer = new Konva.Transformer({
        enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
        anchorStroke: this.config.innerAnchorStroke,
        anchorFill: this.config.innerAnchorFill,
        anchorSize: this.config.innerAnchorSize,
        anchorCornerRadius: this.config.innerAnchorRadius,
        padding: this.config.innerAnchorPadding,
        keepRatio: this.config.keepRatio,
        flipEnabled: false,
        rotateEnabled: false
      });
    }
    if (!this.topPath) {
      this.topPath = this.config.path.clone();
      const attrs1 = this.config.path.getAttrs(), attrs2 = this.topPath.getAttrs();
      const mn2 = "matchClonedAttrs";
      for (const key of Object.keys(attrs1)) {
        if (attrs1[key] !== attrs2[key]) {
          Logger.log(mn2, "** attr mismatch", key, attrs1[key], attrs2[key]);
        } else {
          Logger.log(mn2, "** attr match", key, attrs1[key]);
        }
      }
    }
    if (!this.topPath) {
      throw new Error("Error: No target shape defined - did you call cropper.init(path: pathShape, ...}) ?");
    }
    if (!this.proxyRect) {
      this.proxyRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "red",
        opacity: 0,
        listening: false,
        draggable: false
        // todo: make invisible again !!! visible: false 
      });
    }
    this.croppingLayer.add(this.bottomImage, this.topPath, this.proxyRect, this.bottomTransformer, this.topTransformer, this.sizeBox);
    Utility.matchPositionAndSize(this.config.path, this.topPath);
    if (this.config.initialWrap) {
      let containedBox = Utility.getShapeClientRect(this.topPath);
      containedBox = Object.assign(containedBox, Utility.rotatePoint(containedBox, this.bottomImage.position(), -this.bottomImage.rotation()));
      let containerBox = Utility.getShapeClientRect(this.bottomImage);
      containerBox = Object.assign(containerBox, Utility.rotatePoint(containerBox, this.bottomImage.position(), -this.bottomImage.rotation()));
      if (!Utility.isRectContained(containedBox, containerBox, this.bottomImage.rotation(), this.topPath.rotation())) {
        _Cropper.setInitialFillPatternImage(this.topPath, this.config.initialWrapMarginPC);
      }
    }
    this.bottomImage.setAttrs({ width: void 0, height: void 0, rotation: this.topPath.rotation(), image: this.config.path.fillPatternImage() });
    if (this.topPath.fillPatternImage()) {
      const imageParams = Utility.calculateImagePosFromPattern(this.topPath);
      Logger.log(mn, "Loading Image params", JSON.stringify(imageParams));
      this.bottomImage.setAttrs(imageParams);
      Logger.log(mn, "Loading Image params readback", JSON.stringify({
        position: this.bottomImage.position(),
        scale: this.bottomImage.scale()
      }));
    }
    this.bottomImage.position(Utility.rotatePoint({ x: this.bottomImage.x(), y: this.bottomImage.y() }, this.topPath.position(), this.topPath.rotation()));
    this.bottomTransformer.nodes([this.bottomImage]);
    this.topTransformer.nodes([this.topPath]);
    this.config.path.hide();
    this.topPath.show();
    this.topPath.moveToTop();
    this.topTransformer.moveToTop();
    this.setProxyRect(this.topPath, this.proxyRect);
    this.setEvents();
    Utility.resetBeenies();
    Logger.log(mn, "Ends", arguments);
    this.eventBus.trigger("opened");
  }
  /**
   * Set up the events for the cropping process.
   */
  setEvents() {
    const mn = "cropper.setEvents";
    Logger.log(mn, "Starts", arguments);
    const that = this;
    Logger.log(mn, "proxy size AA", JSON.stringify(that.proxyRect.getClientRect()));
    this.topTransformer.boundBoxFunc(function(oldBox, newBox) {
      const mn2 = "topTransformer.boundBoxFunc";
      let delta = { x: oldBox.x - newBox.x, y: oldBox.y - newBox.y, width: oldBox.width - newBox.width, height: oldBox.height - newBox.height };
      Logger.log(mn2, "delta ", JSON.stringify(delta));
      const newBox1 = { ...newBox };
      const oldBox1 = { ...oldBox };
      const proxInfo = Object.assign({}, that.proxyRect.position(), that.proxyRect.size());
      proxInfo.x = proxInfo.x - delta.x;
      proxInfo.y = proxInfo.y - delta.y;
      proxInfo.width = proxInfo.width - delta.width;
      proxInfo.height = proxInfo.height - delta.height;
      that.proxyRect.position(proxInfo);
      that.proxyRect.size({ width: proxInfo.width, height: proxInfo.height });
      const anchorDelta = {
        x: that.anchorPos.x - that.lastAnchorPos.x,
        y: that.anchorPos.y - that.lastAnchorPos.y
      };
      const anchorName = that.topTransformer.getActiveAnchor();
      const anchorNode = that.topTransformer.findOne("." + anchorName);
      Utility.safety = 0;
      const clampBox = Utility.clampBoundingBoxWithRotation(
        oldBox1,
        newBox1,
        that.proxyRect,
        that.bottomImage,
        that.bottomImage.rotation(),
        anchorName,
        50,
        50,
        "inside",
        false,
        //that.topTransformer!.keepRatio(),  // do not limit to aspect ratio !
        that.aspectRatio,
        that.bottomImage.position(),
        anchorDelta
      );
      Logger.log(mn2, "oldBox", oldBox1);
      Logger.log(mn2, "newBox", newBox1);
      Logger.log(mn2, "clampBox", clampBox);
      Utility.syncPathFillPatternToImage(that.topPath, that.bottomImage);
      that.lastAnchorPos = Object.assign({}, that.anchorPos);
      that.anchorPos = anchorNode.getAbsolutePosition();
      return clampBox;
    });
    this.topTransformer.on("transformstart", function() {
      const anchorName = that.topTransformer.getActiveAnchor();
      const anchorNode = that.topTransformer.findOne("." + anchorName);
      that.anchorPos = anchorNode.getAbsolutePosition();
      that.lastAnchorPos = Object.assign({}, anchorNode.position());
    });
    this.topTransformer.on("transform", function() {
      var _a;
      const pos = Utility.getShapeClientRect(that.topPath, true);
      that.proxyRect.position({ x: pos.x, y: pos.y });
      that.proxyRect.width(pos.width);
      that.proxyRect.height(pos.height);
      (_a = that.topTransformer) == null ? void 0 : _a.forceUpdate();
    });
    this.bottomTransformer.on("transformstart", function() {
      const anchorName = that.bottomTransformer.getActiveAnchor();
      const anchorNode = that.bottomTransformer.findOne("." + anchorName);
      that.anchorPos = anchorNode.getAbsolutePosition();
      that.lastAnchorPos = Object.assign({}, anchorNode.position());
    });
    this.bottomTransformer.boundBoxFunc(function(oldBox, newBox) {
      const mn2 = "bottomTransformer.boundBoxFunc";
      Logger.log(mn2, "Starts", arguments);
      Logger.log(mn2, "bottomImage!.position()", that.bottomImage.position());
      Logger.log(mn2, "oldBox", JSON.stringify(oldBox));
      Logger.log(mn2, "newBox", JSON.stringify(newBox));
      const pos = Utility.getShapeClientRect(that.bottomImage);
      const delta = { x: oldBox.x - pos.x, y: oldBox.y - pos.y };
      Logger.log(mn2, "delta", JSON.stringify(delta));
      const newBox1 = { ...newBox };
      const oldBox1 = { ...oldBox };
      newBox1.x = newBox.x - delta.x;
      newBox1.y = newBox.y - delta.y;
      oldBox1.x = oldBox.x - delta.x;
      oldBox1.y = oldBox.y - delta.y;
      const anchorDelta = {
        x: that.anchorPos.x - that.lastAnchorPos.x,
        y: that.anchorPos.y - that.lastAnchorPos.y
      };
      const anchorName = that.bottomTransformer.getActiveAnchor();
      const anchorNode = that.bottomTransformer.findOne("." + anchorName);
      Logger.log(mn2, "oldBox1", JSON.stringify(oldBox1));
      Logger.log(mn2, "newBox1", JSON.stringify(newBox1));
      Utility.safety = 0;
      const clampBox = Utility.clampBoundingBoxWithRotation(
        oldBox1,
        newBox1,
        that.proxyRect,
        that.bottomImage,
        that.topPath.rotation(),
        that.bottomTransformer.getActiveAnchor(),
        10,
        10,
        "contain",
        true,
        // Always keep bottom AR
        that.aspectRatio,
        // bottom AR value
        that.bottomImage.position(),
        anchorDelta
      );
      Logger.log(mn2, "returns", clampBox);
      clampBox.x = clampBox.x + delta.x;
      clampBox.y = clampBox.y + delta.y;
      Logger.log(mn2, "returns after delta", clampBox);
      Utility.syncPathFillPatternToImage(that.topPath, that.bottomImage);
      that.lastAnchorPos = Object.assign({}, that.anchorPos);
      that.anchorPos = anchorNode.getAbsolutePosition();
      const ret = clampBox;
      Logger.log(mn2, "returns final", ret);
      return ret;
    });
    this.bottomImage.off("dragstart._vw dragmove._vw");
    this.bottomImage.on("dragstart._vw", function() {
      that.bottomImage.setAttr("_vw_posBeforeDrag", Utility.getShapeClientRect(that.bottomImage));
      that.setProxyRect(that.topPath, that.proxyRect);
      Logger.log(mn, "bottomImage!.position()", that.bottomImage.position());
    });
    this.bottomImage.on("dragmove._vw", function() {
      const mn2 = "bottomImage.dragmove";
      Logger.log(mn2, "Starts", arguments);
      Logger.log(mn2, "bottomImage!.position()", that.bottomImage.position());
      Logger.log(mn2, "topRect pos before drag = " + JSON.stringify(that.proxyRect.position()));
      const innerBox = Utility.getShapeClientRect(that.proxyRect);
      Logger.log(mn2, "proxy box = " + JSON.stringify(innerBox));
      let outerBox = Utility.getShapeClientRect(that.bottomImage);
      Logger.log(mn2, "bottomImage box = " + JSON.stringify(outerBox));
      Logger.log(mn2, "A. _vw_posBeforeDrag = " + JSON.stringify(that.bottomImage.getAttr("_vw_posBeforeDrag")));
      const oldBox = that.bottomImage.getAttr("_vw_posBeforeDrag"), newBox = Utility.getShapeClientRect(that.bottomImage), allowedBox = Utility.clampBoundingBoxWithRotation(
        oldBox,
        newBox,
        that.proxyRect,
        that.bottomImage,
        that.topPath.rotation(),
        "dragging",
        10,
        10,
        "dragging",
        that.topTransformer.keepRatio(),
        1,
        that.bottomImage.position(),
        { x: 0, y: 0 }
      );
      Logger.log(mn2, "allowedBox out = " + JSON.stringify(allowedBox));
      that.bottomImage.setAttr("_vw_posBeforeDrag", allowedBox);
      Logger.log(mn2, "B.  _vw_posBeforeDrag = " + JSON.stringify(that.bottomImage.getAttr("_vw_posBeforeDrag")));
      that.bottomImage.position(allowedBox);
      Logger.log(mn2, "topShape pos after drag = " + JSON.stringify(that.topPath.position()));
      that.setProxyRect(that.topPath, that.proxyRect);
      Utility.syncPathFillPatternToImage(that.topPath, that.bottomImage);
    });
    this.overlay.off("click._vw");
    this.overlay.on("click._vw", function() {
      if (that.config.overlayClickAction.toLowerCase() === "cancel") {
        that.cancel();
      } else {
        that.complete();
      }
    });
    this.topPath.off("transform._vw");
    this.topPath.on("transform._vw", () => {
      const mn2 = "topPath.transform";
      Logger.log(mn2, "Starts");
      Utility.syncPathFillPatternToImage(that.topPath, that.bottomImage);
    });
  }
  /** 
   * Complete the cropping process.
   * 
   * What we need to know to maintain the pattern position is the pattern offset and scale.
   * To re-start the cropping process for a saved / reloading setup we need to know how to set up the bottom image. 
   * For that we need to know its position and scale. Hmmmm.
  */
  complete() {
    const mn = "cropper.complete";
    Logger.log(mn, "Starts", arguments);
    Utility.matchPositionAndSize(this.topPath, this.config.path);
    this.config.path.setAttrs({
      fillPatternImage: this.topPath.fillPatternImage(),
      fillPatternOffset: this.topPath.fillPatternOffset(),
      fillPatternScale: this.topPath.fillPatternScale()
    });
    Logger.log(mn, "returns", this.config.path);
    Logger.log(mn, "Saving Image params", JSON.stringify({
      position: this.bottomImage.position(),
      scale: this.bottomImage.scale()
    }));
    Logger.log(mn, "Saving pattern params", JSON.stringify({
      offset: this.config.path.fillPatternOffset(),
      scale: this.config.path.fillPatternScale()
    }));
    __Pm(this, _Cropper_instances, reset_fn).call(this);
    this.clear();
    this.eventBus.trigger("completed", this.config.path);
    this.eventBus.trigger("closed", this.config.path);
  }
  /** 
   * Cancel the cropping process 
  */
  cancel() {
    const mn = "cropper.cancel";
    Logger.log(mn, "Starts", arguments);
    __Pm(this, _Cropper_instances, reset_fn).call(this);
    this.clear();
    this.eventBus.trigger("canceled", this.config.path);
    this.eventBus.trigger("closed", this.config.path);
  }
  /**
   * User wants to change size of the back image. Maybe its so big the handles are off the screen.
   * Note that if since this affects the back image then keppRatio is in force.
   * 
   * Changes scale by 5% from topleft + 5% from bottom right but need to find out if clamped. Uses dragging clamp logic.
   * 
   * @param direction 
   */
  changeSize(direction) {
    const mn = "cropper.changeSize";
    Logger.log(mn, "Starts", arguments);
    const increment = direction === "increase" ? 1.05 : 0.95;
    Utility.matchPositionAndSize(this.bottomImage, this.sizeBox);
    const oldBox = Utility.getShapeClientRect(this.sizeBox);
    const scale = this.sizeBox.scale();
    this.sizeBox.scale({ x: scale.x * increment, y: scale.y * increment });
    const newBox = Utility.getShapeClientRect(this.sizeBox);
    const delta = {
      width: oldBox.width - newBox.width,
      height: oldBox.height - newBox.height
    };
    newBox.y += delta.height / 2;
    newBox.x += delta.width / 2;
    Logger.log(mn, "oldBox", oldBox);
    Logger.log(mn, "newBox", newBox);
    const allowedBox = Utility.clampBoundingBoxWithRotation(
      oldBox,
      newBox,
      this.proxyRect,
      this.bottomImage,
      this.topPath.rotation(),
      "na",
      10,
      10,
      "dragging",
      true,
      this.aspectRatio,
      this.bottomImage.position(),
      { x: 0, y: 0 }
    );
    const scaleChange = {
      x: allowedBox.width / oldBox.width,
      y: allowedBox.height / oldBox.height
    };
    this.bottomImage.scale({
      x: this.bottomImage.scale().x * scaleChange.x,
      y: this.bottomImage.scale().y * scaleChange.y
    });
    this.bottomImage.position({ x: allowedBox.x, y: allowedBox.y });
    Utility.syncPathFillPatternToImage(this.topPath, this.bottomImage);
  }
  /** 
   * Clear up all the elements created by the cropper 
  */
  clear() {
    const mn = "cropper.clear";
    Logger.log(mn, "Starts", arguments);
    if (this.topTransformer) {
      this.topTransformer.off("transform._vw");
      this.topTransformer.nodes([]);
      this.topTransformer.remove();
      this.topTransformer.destroy();
      this.topTransformer = void 0;
    }
    if (this.bottomTransformer) {
      this.bottomTransformer.off("transform._vw");
      this.bottomTransformer.nodes([]);
      this.bottomTransformer.remove();
      this.bottomTransformer.destroy();
      this.bottomTransformer = void 0;
    }
    if (this.topPath) {
      this.topPath.off("transform._vw");
      this.topPath.remove();
      this.topPath.destroy();
      this.topPath = void 0;
    }
    if (this.bottomImage) {
      this.bottomImage.off("dragstart._vw dragmove._vw");
      this.bottomImage.remove();
      this.bottomImage.destroy();
      this.bottomImage = void 0;
    }
    if (this.fullImage) {
      this.fullImage.remove();
      this.fullImage.destroy();
      this.fullImage = void 0;
    }
    if (this.overlay) {
      this.overlay.off("click._vw");
      this.overlay.remove();
      this.overlay.destroy();
      this.overlay = void 0;
    }
    this.croppingLayer.hide();
    this.croppingLayer.remove();
    this.croppingLayer.destroy();
    this.croppingLayer = void 0;
    this.targetTransformer = void 0;
    this.targetTransformerNodes = [];
    this.config.path.visible(true);
  }
  getMousePos() {
    if (this.croppingLayer) {
      const pos = this.croppingLayer.getRelativePointerPosition();
      return Utility.roundPoint(pos, 2);
    }
    return { x: 0, y: 0 };
  }
  /**
   * We use a proxy shape to manage box clamping - make it match the 
   * visible size of the top path. Called from anywhere we change anything
   * to do with size and position of the top path.
   * 
   * @param topRect 
   * @param proxyRect 
   */
  setProxyRect(topRect, proxyRect) {
    const shapeRect = Utility.getShapeClientRect(topRect);
    proxyRect.scale({ x: 1, y: 1 });
    proxyRect.setAttrs(shapeRect);
    proxyRect.rotation(topRect.rotation());
    proxyRect.moveToTop();
  }
  /**
   * Utility func to let the user position the fillPatternImage to hug the node
   */
  static setInitialFillPatternImage(node, percent = 0) {
    if (node.fillPatternImage()) {
      const posImg = new Konva.Image({
        image: node.fillPatternImage()
      });
      let savedRotation = node.rotation();
      node.rotation(0);
      const nodeSize = node.getClientRect({
        skipShadow: true,
        skipStroke: true,
        relativeTo: node.getLayer()
      });
      node.rotation(savedRotation);
      const nodePos = node.getClientRect({
        skipShadow: true,
        skipStroke: true,
        relativeTo: node.getLayer()
      });
      const img = node.fillPatternImage();
      const aW = (percent / 100 + 1) * nodeSize.width / img.naturalWidth;
      const aH = (percent / 100 + 1) * nodeSize.height / img.naturalHeight;
      const a = Math.max(aW, aH);
      posImg.scale({ x: a, y: a });
      const imgPos = posImg.getClientRect({
        skipShadow: true,
        skipStroke: true,
        relativeTo: node.getLayer()
      });
      posImg.position({ x: nodePos.x + (nodePos.width - imgPos.width) / 2, y: nodePos.y + (nodePos.height - imgPos.height) / 2 });
      const centerPoint = { x: nodePos.x + nodePos.width / 2, y: nodePos.y + nodePos.height / 2 };
      const pt = Utility.rotatePoint(posImg.position(), centerPoint, savedRotation);
      posImg.position(pt);
      posImg.rotation(node.rotation());
      Utility.syncPathFillPatternToImage(node, posImg);
    }
  }
};
_Cropper_instances = new WeakSet();
reset_fn = function() {
  if (this.nodeListening) {
    this.config.path.listening(true);
  }
  if (this.targetTransformer) {
    this.targetTransformer.nodes(this.targetTransformerNodes);
  }
};
__Pf(_Cropper, "eventNameList", ["opened", "completed", "canceled", "closed"]);
let Cropper = _Cropper;
const _Utility = class _Utility {
  static get version() {
    const v = _Utility._version;
    return `${v.major}.${v.minor}.${v.patch}${v.special.length > 0 ? "-" + v.special : ""}`;
  }
  static runMode() {
    try {
      if (document) {
        return "browser";
      }
    } catch (e) {
      return "node";
    }
    return "node";
  }
  // A copy of what ?? does, but for longer lists. 
  // Return the first arg that is not null and not undefined. 
  // Return null if not found.
  static Coalesce(...args) {
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] !== "undefined" && args[i] !== null) {
        return args[i];
      }
    }
    return null;
  }
  static getSegment() {
    return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1).toUpperCase();
  }
  static PseudoGuid() {
    const fC = this.getSegment;
    return fC() + fC() + "-" + fC() + "-" + fC() + "-" + fC() + "-" + fC() + fC() + fC();
  }
  static getUUID() {
    try {
      return self.crypto.randomUUID();
    } catch (err) {
      return this.PseudoGuid();
    }
  }
  /**
  * Cheap clone for JSON objects only - will result in a deep copy ! Useful because Object.assign does NOT do deep copy!!
  * @param { * } sourceObject
  * @returns
  */
  static JSONCopy(sourceObject) {
    return JSON.parse(JSON.stringify(sourceObject));
  }
  /**
   * Copy keys from source to output objects. Has handy list for keys to take and keys to leave.
   * Is safe for Konva attrs which appear as functions.
   */
  static copyObject(sourceObject, takeKeyList, leaveKeyList = []) {
    const mn = "copyObject";
    Logger.log(mn, "Starts", arguments);
    const outputObj = {};
    if (takeKeyList.length > 0) {
      for (const key of takeKeyList) {
        Logger.log(mn, "takeKey", key);
        if (typeof sourceObject[key] === "function") {
          outputObj[key] = sourceObject[key]();
        } else {
          outputObj[key] = sourceObject[key];
        }
      }
    } else {
      for (const key of Object.keys(sourceObject)) {
        Logger.log(mn, "key", key);
        if (leaveKeyList.length > 0) {
          if (!leaveKeyList.includes(key)) {
            Logger.log(mn, "leaveKey", key);
            outputObj[key] = sourceObject[key];
          }
        } else {
          Logger.log(mn, "else take unspecified", key);
          if (typeof sourceObject[key] === "function") {
            outputObj[key] = sourceObject[key]();
          } else {
            outputObj[key] = sourceObject[key];
          }
        }
      }
    }
    Logger.log(mn, "returns", outputObj);
    return outputObj;
  }
  // Project specific
  // get the visible layer rect.
  static getLayerRect(layer) {
    const canvas = layer.getCanvas(), transform = layer.getAbsoluteTransform().copy(), inverseTransform = transform.invert(), c1 = inverseTransform.point({ x: 0, y: 0 }), c2 = inverseTransform.point({ x: canvas.width, y: canvas.height }), viewRect = {
      x: c1.x,
      y: c1.y,
      width: c2.x - c1.x,
      height: c2.y - c1.y,
      centerX: c1.x + (c2.x - c1.x) / 2,
      centerY: c1.y + (c2.y - c1.y) / 2
    };
    return viewRect;
  }
  /**
   * Positions shape B to exactly match the position of shape A, regardless of their respective hierarchies in the stage.
   * This handles all cases:
   * - Shapes on different layers
   * - Shapes in different groups
   * - Shapes with different parent transforms
   * 
   * @param source The shape to copy position from
   * @param target The shape to position
   */
  static matchShapePosition(source, target) {
    var _a;
    const mn = "matchShapePosition";
    Logger.log(mn, "Starts", arguments);
    const sourceAbsTransform = source.getAbsoluteTransform();
    const targetLayerTransform = (_a = target.getLayer()) == null ? void 0 : _a.getAbsoluteTransform();
    if (!targetLayerTransform) {
      console.warn("Target shape is not attached to a layer");
      return;
    }
    const layerInverse = targetLayerTransform.copy().invert();
    const relativeTransform = layerInverse.multiply(sourceAbsTransform);
    Logger.log(mn, "relativeTransform = ", relativeTransform.decompose());
    target.setAttrs(relativeTransform.decompose());
  }
  /**
   * Same as matchShapePosition but also copies size attributes if they exist
   * 
   * @param source The shape to copy position and size from
   * @param target The shape to position and resize
   */
  static matchPositionAndSize(source, target) {
    const mn = "matchPositionAndSize";
    Logger.log(mn, "Starts", arguments);
    _Utility.matchShapePosition(source, target);
    const sizeAttrs = ["width", "height", "radiusX", "radiusY", "radius", "stroke", "strokeWidth", "fill", "fillPatternImage", "fillPatternOffset", "fillPatternScale", "data"];
    for (const attr of sizeAttrs) {
      const value = source.getAttr(attr);
      if (value !== void 0) {
        Logger.log(mn, "Matched attr " + attr + " to " + value);
        target.setAttr(attr, value);
      }
    }
    Logger.log(mn, "Ends");
  }
  /**
   * Sync the fill pattern of the path to the bottomimage.
   * 
   * @param path The path to sync
   * @param image The image to sync to
   */
  static syncPathFillPatternToImage(path, image) {
    const imageElement = image.image();
    if (!imageElement) return;
    path.fillPatternImage(imageElement);
    const imageDisplayScale = {
      x: image.width() / imageElement.naturalWidth * image.scaleX(),
      y: image.height() / imageElement.naturalHeight * image.scaleY()
    };
    path.fillPatternScaleX(imageDisplayScale.x / path.scaleX());
    path.fillPatternScaleY(imageDisplayScale.y / path.scaleY());
    const dx = image.x() - path.x();
    const dy = image.y() - path.y();
    const rotation = image.rotation();
    const angleRad = -rotation * Math.PI / 180;
    const unrotatedDx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
    const unrotatedDy = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
    const patternDx = unrotatedDx / imageDisplayScale.x;
    const patternDy = unrotatedDy / imageDisplayScale.y;
    path.fillPatternOffsetX(-patternDx);
    path.fillPatternOffsetY(-patternDy);
    path.fillPatternRepeat("no-repeat");
  }
  /**
   * Clamp a Konva node's bounding box so that a specific containedRect (in local coordinates of the contained shape)
   * is fully contained within the containerRect. The rest of the contained shape may leak outside.
   * All anchor, aspect ratio, min size, and mode logic is preserved.
   * 
   * @param oldBox - The previous bounding box (from Konva)
   * @param newBox - The proposed new bounding box (from Konva)
   * @param containedRect - The rect (in local coordinates of the contained shape) that must be contained
   * @param containerRect - The container's bounding box (in stage coordinates)
   * @param anchorName - The name of the anchor being dragged (e.g., 'top-left', 'bottom-right')
   * @param minWidth - Minimum allowed width (default: 10)
   * @param minHeight - Minimum allowed height (default: 10)
   * @returns The corrected bounding box to apply
   */
  static clampBoundingBoxWithContainedRectFull(oldBox, newBox, containedRect, containerRect, anchorName, minWidth = 10, minHeight = 10, mode = "inside", keepRatio = false, aspectRatio = 1) {
    const mn = "clampBoundingBoxWithContainedRectFull";
    Logger.log(mn, "Starts ", arguments);
    let { x, y, width, height } = newBox;
    width = Math.max(width, minWidth);
    height = Math.max(height, minHeight);
    if (keepRatio) {
      if (anchorName && (anchorName.includes("left") || anchorName.includes("right"))) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }
      width = Math.max(width, minWidth);
      height = Math.max(height, minHeight);
    }
    const dx = containedRect.x - oldBox.x;
    const dy = containedRect.y - oldBox.y;
    let containedRectAbs = {
      x: x + dx,
      y: y + dy,
      width: containedRect.width,
      height: containedRect.height
    };
    if (containedRectAbs.x < containerRect.x) {
      x += containerRect.x - containedRectAbs.x;
      containedRectAbs.x = containerRect.x;
    }
    if (containedRectAbs.y < containerRect.y) {
      y += containerRect.y - containedRectAbs.y;
      containedRectAbs.y = containerRect.y;
    }
    if (containedRectAbs.x + containedRectAbs.width > containerRect.x + containerRect.width) {
      x -= containedRectAbs.x + containedRectAbs.width - (containerRect.x + containerRect.width);
      containedRectAbs.x = containerRect.x + containerRect.width - containedRectAbs.width;
    }
    if (containedRectAbs.y + containedRectAbs.height > containerRect.y + containerRect.height) {
      y -= containedRectAbs.y + containedRectAbs.height - (containerRect.y + containerRect.height);
      containedRectAbs.y = containerRect.y + containerRect.height - containedRectAbs.height;
    }
    width = Math.max(width, minWidth);
    height = Math.max(height, minHeight);
    if (mode === "contain") {
      if (containedRect.width > containerRect.width) {
        width -= containedRect.width - containerRect.width;
        containedRectAbs.width = containerRect.width;
      }
      if (containedRect.height > containerRect.height) {
        height -= containedRect.height - containerRect.height;
        containedRectAbs.height = containerRect.height;
      }
      width = Math.max(width, minWidth);
      height = Math.max(height, minHeight);
    }
    Logger.log(mn, "returns ", { x, y, width, height });
    return { x, y, width, height };
  }
  /**
   * Clamps one rect inside another, both could be rotated by the same angle.
   * Returns the new crop box (x, y, width, height, rotation).
   */
  static clampBoundingBoxWithRotation(oldBox, newBox, containedShape, containingShape, angleDegrees, anchorName, minWidth = 10, minHeight = 10, mode = "inside", keepRatio = false, aspectRatio = 1, refPoint, anchorDelta) {
    const mn = "clampBoundingBoxWithRotation";
    Logger.log(mn, "Starts", arguments);
    const referencePoint = refPoint;
    let oldUnrotated = { x: oldBox.x, y: oldBox.y, width: oldBox.width, height: oldBox.height };
    oldUnrotated = Object.assign(oldUnrotated, _Utility.rotatePoint(oldBox, referencePoint, -angleDegrees));
    let newUnrotated = { x: newBox.x, y: newBox.y, width: newBox.width, height: newBox.height };
    newUnrotated = Object.assign(newUnrotated, _Utility.rotatePoint(newBox, referencePoint, -angleDegrees));
    let containedBox = _Utility.getShapeClientRect(containedShape);
    containedBox = Object.assign(containedBox, _Utility.rotatePoint(containedBox, referencePoint, -angleDegrees));
    let containerBox = _Utility.getShapeClientRect(containingShape);
    containerBox = Object.assign(containerBox, _Utility.rotatePoint(containerBox, referencePoint, -angleDegrees));
    let ret = _Utility.clampBoundingBox(oldUnrotated, newUnrotated, containedBox, containerBox, anchorName, minWidth, minHeight, mode, keepRatio, aspectRatio, anchorDelta);
    Logger.log(mn, "returned clampbox = " + JSON.stringify(ret));
    ret = Object.assign(ret, _Utility.rotatePoint(ret, referencePoint, angleDegrees));
    const ret2 = Object.assign(ret, { rotation: angleDegrees * Math.PI / 180 });
    Logger.log(mn, "returns ", ret2);
    return ret2;
  }
  /**
   * Test if one rotated rectangle is contained within another
   * @param inner The inner rectangle {x, y, width, height}
   * @param outer The outer rectangle {x, y, width, height}
   * @param innerRotation Rotation of inner rectangle in degrees
   * @param outerRotation Rotation of outer rectangle in degrees
   * @returns true if inner rectangle is completely contained within outer rectangle
   */
  static isRectContained(inner, outer, innerRotation, outerRotation) {
    const innerCorners = [
      { x: inner.x, y: inner.y },
      { x: inner.x + inner.width, y: inner.y },
      { x: inner.x + inner.width, y: inner.y + inner.height },
      { x: inner.x, y: inner.y + inner.height }
    ];
    const innerCenter = {
      x: inner.x + inner.width / 2,
      y: inner.y + inner.height / 2
    };
    const rotatedInnerCorners = innerCorners.map(
      (corner) => _Utility.rotatePoint(corner, innerCenter, innerRotation)
    );
    const outerCorners = [
      { x: outer.x, y: outer.y },
      { x: outer.x + outer.width, y: outer.y },
      { x: outer.x + outer.width, y: outer.y + outer.height },
      { x: outer.x, y: outer.y + outer.height }
    ];
    const outerCenter = {
      x: outer.x + outer.width / 2,
      y: outer.y + outer.height / 2
    };
    const rotatedOuterCorners = outerCorners.map(
      (corner) => _Utility.rotatePoint(corner, outerCenter, outerRotation)
    );
    const isPointInPolygon = (point, polygon) => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        const intersect = yi > point.y !== yj > point.y && point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    };
    return rotatedInnerCorners.every(
      (corner) => isPointInPolygon(corner, rotatedOuterCorners)
    );
  }
  /**
   * Rotates a point around a center by a given angle (in degrees).
   * @param point - The point to rotate ({ x, y })
   * @param center - The center of rotation ({ x, y })
   * @param angleDeg - The angle in degrees (positive is counterclockwise)
   * @returns The rotated point as { x, y }
   */
  static rotatePoint(point, center, angleDeg) {
    const angleRad = angleDeg * Math.PI / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return {
      x: center.x + dx * cos - dy * sin,
      y: center.y + dx * sin + dy * cos
    };
  }
  /**
   *  Return a rounded number stripping extra zeroes.
   */
  static round(val, dp) {
    dp = dp == void 0 ? 2 : dp;
    return parseFloat(val.toFixed(dp));
  }
  /** Round a point */
  static roundPoint(point, dp) {
    return {
      x: this.round(point.x, dp),
      y: this.round(point.y, dp)
    };
  }
  /** 
   * Round all the points in a rect
   */
  static roundRect(rect, decimals = 0) {
    return { x: _Utility.round(rect.x, decimals), y: _Utility.round(rect.y, decimals), width: _Utility.round(rect.width, decimals), height: _Utility.round(rect.height, decimals) };
  }
  /**
   * Compare the points of two rects
   */
  static rectCompare(rect1, rect2) {
    if (rect1.x === rect2.x && rect1.y === rect2.y && rect1.width === rect2.width && rect1.height === rect2.height) {
      return true;
    }
    return false;
  }
  /**
   * ** DO NOT MESS WITH THIS FUNCTION - IT WAS COSTLY TO CREATE **
   * 
   * This function is used to find the visible rotated rect on the layer for any shape. 
   * 
   * Why not use shape.getClientRect() ? 
   * 
   * Good question. Getting the client rect for plain rect-based shapes is straightforward. But 
   * for Konva.Path shapes getClientRect returns the rect of the visibele path component(s) - but
   * NOT the entire shape. In this case we have to work harder. 
   * 
   * The approach is based around getting the rotated client rect of the shape to find the center 
   * of rotation, then rotating the shape by around this point to be axis-aligned, which gives the 
   * fitting client rect, then rotating the topleft point if this rect around its center to get the 
   * position of this visible client rect. That gives the position, size and angle of the visible 
   * shape. Phew. 
   * 
   * @param shape 
   * @returns 
   */
  static getShapeClientRect(shape, skipStroke = true) {
    const mn = "getShapeClientRect";
    const shapePos = shape.position();
    Logger.log(mn, "Shape position:", shapePos);
    const rotation = shape.rotation();
    const position = shape.position();
    Logger.log(mn, "Original rotation:", rotation);
    const rotatedRect = shape.getClientRect({
      skipShadow: true,
      skipStroke,
      // wip: strokefix orig was true 
      relativeTo: shape.getLayer()
    });
    const centerX = rotatedRect.x + rotatedRect.width / 2;
    const centerY = rotatedRect.y + rotatedRect.height / 2;
    Logger.log(mn, "Center point:", { x: centerX, y: centerY });
    const origin = _Utility.rotatePoint(
      { x: shape.x(), y: shape.y() },
      { x: centerX, y: centerY },
      -rotation
    );
    shape.position(origin);
    shape.rotation(0);
    const visibleRect = shape.getClientRect({
      skipShadow: true,
      skipStroke,
      // wip: strokefix orig was true
      relativeTo: shape.getLayer()
    });
    const visibleCenterX = visibleRect.x + visibleRect.width / 2;
    const visibleCenterY = visibleRect.y + visibleRect.height / 2;
    const visiblePos = _Utility.rotatePoint(
      { x: visibleRect.x, y: visibleRect.y },
      { x: visibleCenterX, y: visibleCenterY },
      rotation
    );
    Logger.log(mn, "Visible rect:", visibleRect);
    Logger.log(mn, "Visible pos:", visiblePos);
    shape.position(position);
    shape.rotation(rotation);
    const result = {
      x: visiblePos.x,
      y: visiblePos.y,
      width: visibleRect.width,
      height: visibleRect.height
    };
    Logger.log(mn, "Final rotated result:", result);
    return result;
  }
  static findTransformerForNode(node) {
    const stage = node.getStage();
    if (!stage) return void 0;
    const transformers = stage.find("Transformer");
    for (const transformer of transformers) {
      if (transformer.nodes().includes(node)) {
        return transformer;
      }
    }
    return void 0;
  }
  static n434(val) {
    return new Date(val);
  }
  /**
   * Calculate the image position and scale from the path's fill pattern attributes.
   * 
   * @param path The Konva.Path with fill pattern attributes
   * @returns An object containing the image position and scale
   */
  static calculateImagePosFromPattern(path) {
    const patternOffset = {
      x: path.fillPatternOffsetX(),
      y: path.fillPatternOffsetY()
    };
    const patternScale = {
      x: path.fillPatternScaleX(),
      y: path.fillPatternScaleY()
    };
    const imageScale = {
      x: patternScale.x * path.scaleX(),
      y: patternScale.y * path.scaleY()
    };
    const imagePos = {
      x: path.x() - patternOffset.x * imageScale.x,
      y: path.y() - patternOffset.y * imageScale.y
    };
    return {
      position: imagePos,
      scale: imageScale
    };
  }
  static resetBeenies() {
    _Utility.enclosed = false;
    _Utility.beenInside = {
      left: false,
      right: false,
      top: false,
      bottom: false
    };
  }
  static inside_handleLeftAnchor(anchorName, innerBox, outerBox, minWidth, oldBox, hDir, force) {
    const mn = "handleLeftAnchor";
    Logger.log(mn, "Starts from " + anchorName);
    let failCase = "";
    failCase = innerBox.left > outerBox.right ? "rightEscape" : failCase;
    failCase = _Utility.beenInside.left && innerBox.left < outerBox.left ? "leftEscape" : failCase;
    failCase = innerBox.left > innerBox.right - Math.abs(minWidth) ? "minWidth" : failCase;
    failCase = innerBox.left > outerBox.right - Math.abs(minWidth) ? "minWidthRight" : failCase;
    failCase = hDir === "right" && (_Utility.beenInside.right && innerBox.right > outerBox.right) ? "scaleRightEscape" : failCase;
    if (failCase !== "") {
      force.x = oldBox.x;
      force.width = oldBox.width;
      if (failCase === "scaleRightEscape") {
        force.x = oldBox.x + (outerBox.right - innerBox.right);
      }
    }
    return force;
  }
  static inside_handleTopAnchor(anchorName, innerBox, outerBox, minHeight, oldBox, force) {
    const mn = "handleTopAnchor";
    Logger.log(mn, "Starts from " + anchorName);
    let failCase = "";
    failCase = innerBox.top > outerBox.bottom ? "bottomEscape" : failCase;
    failCase = _Utility.beenInside.top && innerBox.top < outerBox.top ? "topEscape" : failCase;
    failCase = innerBox.top > innerBox.bottom - minHeight ? "minHeight" : failCase;
    failCase = _Utility.beenInside.bottom && innerBox.bottom > outerBox.bottom ? "scaleBottomEscape" : failCase;
    if (failCase !== "") {
      force.y = oldBox.y;
      force.height = oldBox.height;
      if (failCase === "scaleRightEscape") {
        force.y = oldBox.y + (outerBox.bottom - innerBox.bottom);
      }
    }
    return force;
  }
  static inside_handleRightAnchor(anchorName, innerBox, outerBox, minWidth, oldBox, hDir, force) {
    const mn = "handleRightAnchor";
    Logger.log(mn, "Starts from " + anchorName);
    let failCase = "";
    failCase = _Utility.beenInside.right && innerBox.right > outerBox.right ? "rightEscape" : failCase;
    failCase = innerBox.right < outerBox.left ? "leftFarEscape" : failCase;
    failCase = innerBox.right < innerBox.left + Math.abs(minWidth) ? "minWidth" : failCase;
    failCase = outerBox.left + Math.abs(minWidth) > innerBox.right ? "minWidthLeft" : failCase;
    failCase = hDir === "left" && _Utility.beenInside.left && innerBox.left < outerBox.left ? "scaleLeftEscape" : failCase;
    if (failCase !== "") {
      force.x = oldBox.x;
      force.width = oldBox.width;
      if (failCase === "scaleLeftEscape") {
        force.x = oldBox.x + (outerBox.left - innerBox.left);
      }
    }
    return force;
  }
  static inside_handleBottomAnchor(anchorName, innerBox, outerBox, minHeight, oldBox, force) {
    const mn = "handleBottomAnchor";
    Logger.log(mn, "Starts from " + anchorName);
    let failCase = "";
    failCase = _Utility.beenInside.bottom && outerBox.top + minHeight > innerBox.bottom ? "minHeightTop" : failCase;
    failCase = _Utility.beenInside.bottom && innerBox.bottom > outerBox.bottom ? "bottomEscape" : failCase;
    failCase = innerBox.top > innerBox.bottom - minHeight ? "minHeightBottom" : failCase;
    failCase = _Utility.beenInside.top && innerBox.top < outerBox.top ? "scaleTopEscape" : failCase;
    if (failCase !== "") {
      force.y = oldBox.y;
      force.height = oldBox.height;
      if (failCase === "scaleTopEscape") {
        force.y = oldBox.y + (outerBox.top - innerBox.top);
      }
    }
    return force;
  }
  static contain_handleLeftAnchor(anchorName, innerBox, newBox, oldBox, hDir, force) {
    const mn = "contain_handleLeftAnchor";
    Logger.log(mn, "Starts from " + anchorName);
    if (_Utility.enclosed) {
      let failCase = "";
      failCase = _Utility.beenInside.left && hDir == "center" ? "centerMove" : failCase;
      failCase = failCase === "" && _Utility.beenInside.left && newBox.x <= innerBox.left ? "allow" : failCase;
      failCase = failCase === "" && _Utility.beenInside.left && newBox.x > innerBox.left ? "overlap" : failCase;
      if (failCase !== "" && failCase !== "allow") {
        force.x = oldBox.x;
        force.width = oldBox.width;
      }
    }
    return force;
  }
  static contain_handleRightAnchor(anchorName, innerBox, newBox, oldBox, hDir, force) {
    const mn = "contain_handleRightAnchor";
    Logger.log(mn, "Starts from " + anchorName);
    if (_Utility.enclosed) {
      let failCase = "";
      failCase = _Utility.beenInside.right && hDir == "center" ? "centerMove" : failCase;
      failCase = failCase === "" && _Utility.beenInside.right && innerBox.right <= newBox.x + newBox.width ? "allow" : failCase;
      failCase = failCase === "" && _Utility.beenInside.right && innerBox.right > newBox.x + newBox.width ? "overlap" : failCase;
      if (failCase !== "" && failCase !== "allow") {
        force.x = oldBox.x;
        force.width = oldBox.width;
      }
    }
    return force;
  }
  static contain_handleTopAnchor(anchorName, innerBox, newBox, oldBox, vDir, force) {
    const mn = "contain_handleTopAnchor";
    Logger.log(mn, "Starts from " + anchorName);
    if (_Utility.enclosed) {
      let failCase = "";
      failCase = _Utility.beenInside.top && vDir == "center" ? "centerMove" : failCase;
      failCase = failCase === "" && _Utility.beenInside.top && newBox.y <= innerBox.top ? "allow" : failCase;
      failCase = failCase === "" && _Utility.beenInside.top && newBox.y > innerBox.top ? "overlap" : failCase;
      if (failCase !== "" && failCase !== "allow") {
        force.y = oldBox.y;
        force.height = oldBox.height;
      }
    }
    return force;
  }
  static contain_handleBottomAnchor(anchorName, innerBox, newBox, oldBox, vDir, force) {
    const mn = "contain_handleBottomAnchor";
    Logger.log(mn, "Starts from " + anchorName);
    if (_Utility.enclosed) {
      let failCase = "";
      failCase = _Utility.beenInside.bottom && vDir == "center" ? "centerMove" : failCase;
      failCase = failCase === "" && _Utility.beenInside.bottom && newBox.y + newBox.height >= innerBox.bottom ? "allow" : failCase;
      failCase = failCase === "" && _Utility.beenInside.bottom && newBox.y + newBox.height < innerBox.bottom ? "overlap" : failCase;
      if (failCase !== "" && failCase !== "allow") {
        force.y = oldBox.y;
        force.height = oldBox.height;
      }
    }
    return force;
  }
  static checkRatio(keepRatio, aspectRatio, width, height) {
    const mn = "checkRatio";
    if (keepRatio) {
      const epsilon = 125e-5;
      const actualRatio = width / height;
      if (Math.abs(actualRatio - aspectRatio) > epsilon) {
        Logger.log(mn, "** Fails aspectRatio check");
        return false;
      }
    }
    return true;
  }
  static clampBoundingBox(oldBox, newBox, innerRect, outerRect, anchorName, minWidth = 10, minHeight = 10, mode = "inside", keepRatio = false, aspectRatio = 1, anchorDelta) {
    const mn = "clampBoundingBox";
    let innerBox = _Utility.rectToBox(_Utility.roundRect(innerRect)), outerBox = _Utility.rectToBox(_Utility.roundRect(outerRect));
    let hDir = _Utility.round(anchorDelta.x, 1) > 0 ? "right" : "left";
    hDir = _Utility.round(anchorDelta.x, 1) === 0 ? "center" : hDir;
    let vDir = _Utility.round(anchorDelta.y, 1) >= 0 ? "down" : "up";
    vDir = _Utility.round(anchorDelta.y, 1) === 0 ? "center" : vDir;
    _Utility.beenInside.left = !_Utility.beenInside.left && outerBox.left < innerBox.left ? true : _Utility.beenInside.left;
    _Utility.beenInside.right = !_Utility.beenInside.right && outerBox.right > innerBox.right ? true : _Utility.beenInside.right;
    _Utility.beenInside.top = !_Utility.beenInside.top && outerBox.top < innerBox.top ? true : _Utility.beenInside.top;
    _Utility.beenInside.bottom = !_Utility.beenInside.bottom && outerBox.bottom > innerBox.bottom ? true : _Utility.beenInside.bottom;
    const enclosedNow = outerBox.left < innerBox.left && outerBox.right > innerBox.right && outerBox.top < innerBox.top && outerBox.bottom > innerBox.bottom;
    _Utility.enclosed = _Utility.enclosed === false && enclosedNow ? true : _Utility.enclosed;
    Logger.log(mn, ".beenInside = " + _Utility.beenInside.left + " / " + _Utility.beenInside.top + " / " + _Utility.beenInside.right + " / " + _Utility.beenInside.bottom + " gas been enclosed = " + _Utility.enclosed);
    let force = _Utility.JSONCopy(newBox);
    if (mode === "inside") {
      switch (anchorName) {
        case "top-left": {
          force = _Utility.inside_handleLeftAnchor(anchorName, innerBox, outerBox, minWidth, oldBox, hDir, force);
          force = _Utility.inside_handleTopAnchor(anchorName, innerBox, outerBox, minHeight, oldBox, force);
          break;
        }
        case "top-center": {
          force = _Utility.inside_handleTopAnchor(anchorName, innerBox, outerBox, minHeight, oldBox, force);
          break;
        }
        case "top-right": {
          force = _Utility.inside_handleRightAnchor(anchorName, innerBox, outerBox, minWidth, oldBox, hDir, force);
          force = _Utility.inside_handleTopAnchor(anchorName, innerBox, outerBox, minHeight, oldBox, force);
          break;
        }
        case "middle-left": {
          force = _Utility.inside_handleLeftAnchor(anchorName, innerBox, outerBox, minWidth, oldBox, hDir, force);
          break;
        }
        case "middle-right": {
          force = _Utility.inside_handleRightAnchor(anchorName, innerBox, outerBox, minWidth, oldBox, hDir, force);
          break;
        }
        case "bottom-left": {
          force = _Utility.inside_handleLeftAnchor(anchorName, innerBox, outerBox, minWidth, oldBox, hDir, force);
          force = _Utility.inside_handleBottomAnchor(anchorName, innerBox, outerBox, minHeight, oldBox, force);
          break;
        }
        case "bottom-center": {
          force = _Utility.inside_handleBottomAnchor(anchorName, innerBox, outerBox, minHeight, oldBox, force);
          break;
        }
        case "bottom-right": {
          force = _Utility.inside_handleRightAnchor(anchorName, innerBox, outerBox, minWidth, oldBox, hDir, force);
          force = _Utility.inside_handleBottomAnchor(anchorName, innerBox, outerBox, minHeight, oldBox, force);
          break;
        }
      }
    }
    if (mode === "contain") {
      switch (anchorName) {
        case "top-left": {
          force = _Utility.contain_handleLeftAnchor(anchorName, innerBox, newBox, oldBox, hDir, force);
          force = _Utility.contain_handleTopAnchor(anchorName, innerBox, newBox, oldBox, vDir, force);
          if (keepRatio && !_Utility.checkRatio(keepRatio, aspectRatio, force.width, force.height)) {
            return oldBox;
          }
          break;
        }
        case "top-right": {
          force = _Utility.contain_handleRightAnchor(anchorName, innerBox, newBox, oldBox, hDir, force);
          force = _Utility.contain_handleTopAnchor(anchorName, innerBox, newBox, oldBox, vDir, force);
          if (keepRatio && !_Utility.checkRatio(keepRatio, aspectRatio, force.width, force.height)) {
            return oldBox;
          }
          break;
        }
        case "bottom-left": {
          force = _Utility.contain_handleLeftAnchor(anchorName, innerBox, newBox, oldBox, hDir, force);
          force = _Utility.contain_handleBottomAnchor(anchorName, innerBox, newBox, oldBox, vDir, force);
          if (keepRatio && !_Utility.checkRatio(keepRatio, aspectRatio, force.width, force.height)) {
            return oldBox;
          }
          break;
        }
        case "bottom-right": {
          force = _Utility.contain_handleRightAnchor(anchorName, innerBox, newBox, oldBox, hDir, force);
          force = _Utility.contain_handleBottomAnchor(anchorName, innerBox, newBox, oldBox, vDir, force);
          if (keepRatio && !_Utility.checkRatio(keepRatio, aspectRatio, force.width, force.height)) {
            return oldBox;
          }
          break;
        }
      }
    }
    if (mode === "dragging") {
      if (_Utility.enclosed) {
        let failCase = "";
        failCase = failCase === "" && _Utility.beenInside.left && newBox.x > innerBox.left ? "leftLock" : failCase;
        failCase = failCase === "" && _Utility.beenInside.right && newBox.x + newBox.width < innerBox.right ? "rightLock" : failCase;
        if (failCase !== "") {
          force.x = oldBox.x;
          force.width = oldBox.width;
        }
        failCase = "";
        failCase = failCase === "" && _Utility.beenInside.top && newBox.y > innerBox.top ? "topLock" : failCase;
        failCase = failCase === "" && _Utility.beenInside.bottom && newBox.y + newBox.height < innerBox.bottom ? "bottomLock" : failCase;
        if (failCase !== "") {
          force.y = oldBox.y;
          force.height = oldBox.height;
        }
        if (keepRatio && !_Utility.checkRatio(keepRatio, aspectRatio, force.width, force.height)) {
          return oldBox;
        }
      }
    }
    newBox.x = force.x !== -Infinity ? force.x : newBox.x;
    newBox.y = force.y !== -Infinity ? force.y : newBox.y;
    newBox.width = force.width !== -Infinity ? force.width : newBox.width;
    newBox.height = force.height !== -Infinity ? force.height : newBox.height;
    return newBox;
  }
  // make a box for btter readability in rect manipulation.
  static rectToBox(rect) {
    return {
      x: rect.x,
      y: rect.y,
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    };
  }
};
__Pf(_Utility, "productName", "vwCropper");
__Pf(_Utility, "langCode", "en");
__Pf(_Utility, "mode", "dev");
// static mode = 'live'
__Pf(_Utility, "_version", {
  major: 1,
  minor: 0,
  patch: 0,
  special: "alpha.4"
});
// List of keys to log. '*' will log all keys.
__Pf(_Utility, "logKeys", [
  "error",
  "Error",
  "info",
  "Info",
  "debug",
  "Debug",
  "warning",
  "Warning"
]);
__Pf(_Utility, "r434", /* @__PURE__ */ new Date());
__Pf(_Utility, "safety", 0);
__Pf(_Utility, "enclosed", false);
__Pf(_Utility, "beenInside", {
  left: false,
  right: false,
  top: false,
  bottom: false
});
let Utility = _Utility;
class Logger {
  /**
   * Check if a key should be logged. Keys are set in logKeys variable of Utility.ts. 
   * 
   */
  static shouldLog(k) {
    if (Utility.logKeys.includes(k) || Utility.logKeys.includes("*")) {
      return true;
    }
    return false;
  }
  static log(k, s, ...args) {
    k = k.toLowerCase() === "warn" ? "warning" : k;
    if (Logger.shouldLog(k)) {
      let fn = ["warn", "warning"].includes(k.toLowerCase()) ? console.warn : console.log;
      fn = ["error", "err"].includes(k.toLowerCase()) ? console.error : fn;
      if (args.length > 0) {
        fn(k + " : " + s, ...args);
      } else {
        fn(k + " : " + s);
      }
    }
  }
}
const _Strings = class _Strings {
  constructor() {
    __Pf(this, "_d217", 0);
    __Pf(this, "_d23", []);
    __Pf(this, "_d423", Math.PI);
  }
  get d217() {
    return this._d217;
  }
  get d23() {
    return this._d23;
  }
  set ratio(val) {
    this._d23 = val;
  }
  set d2346(val) {
    if (this._d423 === Math.PI) {
      this._d423 = val;
    }
  }
  get d423() {
    return this._d423;
  }
  static getString(langCode, key, data) {
    let template = __Pg(_Strings, _stringList)[langCode][key];
    if (["_804"].includes(key.replace("error", ""))) {
      template = _Strings.tagReplace(template)[0];
    }
    if (!template) {
      console.warn("Dev error: missing Strings entry for [" + langCode + "] [" + key + "]");
      return "";
    }
    if (typeof data === "object") {
      Object.keys(data).forEach((key2) => {
        let strKey = "${" + key2 + "}";
        template = template.split(strKey).join(data[key2]);
      });
    }
    return template;
  }
  // given a hex array we chop it into its component parts.
  // each part starts with the length of the part in 1 hex value,
  // then is the offset in the offsets list.
  static tagReplace(data) {
    data = data.trim();
    const offsets = _Strings.getString("en", "error_918"), results = [];
    let idx = 0, len = 0, resIdx = 0, finished = false;
    do {
      let hx = data.substr(idx, 2);
      switch (idx) {
        case 0:
          {
            hx = data.substr(idx, 4);
            len = +("0x" + hx);
            idx = idx + 4;
          }
          break;
        case 4:
          {
            const offset = +("0x" + hx), mungedStr = data.substr(idx + 2, len - 6);
            const endsAt = len;
            data = data.substr(endsAt);
            results[resIdx] = "";
            let pos = offset;
            for (let i = 0; i < mungedStr.length; i = i + 2) {
              const valHx = mungedStr.substr(i, 2), valOffset = +("0x" + valHx), val = valOffset - 2 * offsets[pos];
              results[resIdx] = results[resIdx] + String.fromCharCode(val);
              pos = pos + 1 > offsets.length - 1 ? 0 : pos + 1;
            }
            resIdx = resIdx + 1;
            idx = 0;
            if (data.length === 0) {
              finished = true;
            }
          }
          break;
        default: {
          throw new Error("Error - Idx error at " + idx);
        }
      }
      if (finished) {
        break;
      }
    } while (true);
    return results;
  }
  /**
   * This is the function to determine the license condition.
   * 
   * @param that The Strings object
   * @param r The license code supplied in the config at instantiation 
   * @param errCode The error code
   * @returns Void.
   */
  static setStrings(that, r = "", errCode) {
    const mn = "strings.setStrings";
    Logger.log(mn, "Starts ", arguments);
    that._d217 = errCode;
    that.ratio = [];
    const main2 = [[17], [122], [2094]];
    const nd = Utility.r434;
    let prodName = "", expDate = "", demoLic = typeof r === "undefined" || r.length === 0, rd = 0, isDemo = false;
    if (typeof r === "undefined" || r.length === 0) {
      const data = _Strings.tagReplace(_Strings.getString("en", "error_900"));
      if (data.length > 1) {
        expDate = data[1];
        prodName = data[0];
      } else {
        expDate = data[0];
        prodName = "";
      }
      if (rd === 0 && prodName !== Utility.productName) {
        rd = main2[0][0] + 4 - 4 * 5;
      } else {
        rd = main2[2][0] - 2091;
        isDemo = true;
      }
    }
    Logger.log(mn, "isDemo = " + isDemo);
    if (rd === 0) {
      const data = _Strings.tagReplace(r);
      if (data.length >= 5) {
        expDate = data[4];
        prodName = data[0];
      } else {
        isDemo = true;
      }
      if (data.length < 2) {
        rd = main2[1][0] + -120;
      }
      if (rd === 0 && prodName !== Utility.productName) {
        rd = main2[0][0] + 4 - 4 * 5;
      }
      if (rd !== 0) {
        demoLic = true;
        for (const d of data) {
          if (d.length === 10 && d.indexOf("20") === 0) {
            expDate = d;
            break;
          }
        }
        if (expDate.length === 0 && rd !== 0) {
          expDate = _Strings.tagReplace(_Strings.getString("en", "error_900"))[0];
        }
      }
    }
    const expDateStr = expDate + _Strings.tagReplace(_Strings.getString("en", "error_901"))[0];
    const cd = Utility.n434(expDateStr);
    const isExpired = nd.getTime() > cd.getTime();
    const days = Math.floor((cd.getTime() - nd.getTime()) / 864e5);
    let expMsg = "", prod = Utility.productName + " " + Utility.version + _Strings.tagReplace(_Strings.getString("en", "error_915"))[0];
    if (demoLic) {
      expMsg = prod + "\n" + _Strings.tagReplace(_Strings.getString("en", "error_916"))[0];
      expMsg = expMsg.replace("{{d}}", expDate);
      expMsg = expMsg.replace("{{e}}", days.toString());
      expMsg = rd !== 0 ? expMsg + "(" + rd + ")" : expMsg;
    } else {
      const data = _Strings.tagReplace(r);
      expDate = data[3];
      const msgCode = isExpired ? "error_917a" : "error_917";
      expMsg = prod + "\n" + _Strings.tagReplace(_Strings.getString("en", msgCode))[0];
      data.push(days.toString());
      for (let i = 0; i < data.length; i++) {
        const val = data[i];
        const key = ["p", "a", "b", "c", "d", "e"][i];
        expMsg = expMsg.replace("{{" + key + "}}", val);
      }
    }
    let ret = [];
    ret[errCode] = "";
    if (nd.getTime() > cd.getTime()) {
      const sm = _Strings.tagReplace(_Strings.getString("en", "error_904"))[0];
      expMsg = sm + "\n" + expMsg;
      ret.push(2);
      ret[errCode] = "&^";
    } else if (days < 30) {
      ret.push(1);
      ret[errCode] = "^&";
    } else {
      ret.push(0);
    }
    expMsg = expMsg.replaceAll("\\n", "\n");
    ret.push(expMsg);
    that.ratio = ret;
  }
};
_stringList = new WeakMap();
__Pa(_Strings, _stringList, {
  "en": {
    "error_000": "vwRtx object requires configuration arguments.",
    "error_001": "vwRtx object requires a configuration object.",
    "error_002": "vwRtx object requires a reference to the host shape to be passed via congifiguration object property 'host'.",
    "error_003": "vwRtx object requires the name of the canvas library that is in use. Should be one of [${info}].",
    // License expired - see console for details.
    "error_804": "005A075C5D75577E8D733C7174805D8457743A3B3C7F61751475617E8D7D88711C76638412747F827D75688322",
    // not used!!!!!
    // The demo lic key string [prod_code,expiry date] e.g. [vwToolBar,2024-10-39] 
    // "error_900": "00180384934F6E7F64825782001A053E2C42293F2245473F4E", // 2025-05-12
    // "error_900": "001805827353668162807F80001A044E3C2E452142273D4D3E", // 2025-05-30
    "error_900": "00180384934F6E7F64825782001A01424A4051392C46214522",
    // 2025-06-30
    // the midnight string [T23:59:59.000Z]
    "error_901": "00200046424D48514536452D4022404A68",
    // the string  [License expired]
    "error_904": "0024064879577760837F2E81846C79667756",
    // The copyright string  [© Vanquished Wombat Services Ltd]
    "error_915": "0048052CA5304A7360818F778F7461741469617D7C6F902C4F7566885B737F813C587074",
    // the string [Demo license expires in {{e}} days at midnight on {{d}} - contact VanquishedWombat@gmail.com for options] 
    "error_916": "00D6046071697F147E5B737F7C8F711C756C825B827F813C756A306F8D578D972E806D7583147366308777807A65775C86127F882E9787608D71321F307D7D8A805D7368324871887F91756F785976497F87707D803C7761735B7C48718B791C766384127F8A82857B6A83",
    // Has a purchased license messsage: Full license expires in {{e}} days at midnight on {{d}}\nLicensed to\n{{a}}\n{{b}}\n{{c}}\nContact VanquishedWombat@gmail.com for options
    "error_917": "0118064285607E127C8371817A6F7514776A808380817F1C7962326D8B7F8B992C60716D8512718E2E8975607E5D795A843A7D8A2C778B588F6F6C885A856F617E677756308E7D787A778B558F6F6C8889976E798D50806D8B7D8B99686A53638066717D823C625D7E65875B83827380636B7D56736650817B7D75683E57815F30807D8E2C6B80687B617E8D",
    // Full license expired at midnight on {{d}} {{e}} days ago.\nLicensed to\n{{a}}\n{{b}}\n{{c}}\nContact VanquishedWombat@gmail.com for options
    "error_917a": "011C0958677C862E88755F75628557307F868C756E75583253843A7B85706A795B7A6630897C3C877774718F128B957399891C74558B65307B758B3A587E407B5575888181701C84636E608B956F9989587E6F8D548D976A8A877773718F4E7E5D7D8A805D7368324871887F91756F785976497F87707D803C7761735B7C48718B791C766384127F8A82857B6A83",
    // encoding offsets
    "error_918": [-7, 8, 13, 7, 14, 6, -2, 8, -6, 9],
    "error_919": [59, 109, 129, 104, 46, 114, 103, 107, 95, 119, 108, 109, 45, 111, 111, 121, 30, 109, 114, 121, 98, 122, 114, 107, 46, 51, 30, 120, 102, 110, 90, 123, 114, 39, 113, 117, 108, 124, 91, 108, 109, 40, 110, 124, 130, 110, 109, 122, 26, 111, 104, 122, 45, 104, 124, 38, 115, 120, 94, 106, 109, 109, 46],
    // the string [warning,error]
    "error_922": "001405835D82627B6077001001758C808B7E"
  }
});
let Strings = _Strings;
class EventBus {
  constructor(main2) {
    __Pf(this, "main");
    __Pf(this, "listenerMap", /* @__PURE__ */ new Map());
    __Pf(this, "eventNameList", ["created", "activated", "deactivated", "changed", "complete", "cancel"]);
    this.main = main2;
    for (const name of this.eventNameList) {
      this.listenerMap.set(name, []);
    }
  }
  registerListener(eventName, fn) {
    eventName = eventName.toLowerCase();
    if (typeof fn !== "function") {
      return false;
    }
    if (!this.eventNameList.includes(eventName)) {
      console.warn("Event named [" + eventName + "] not available - options are " + this.eventNameList);
    }
    if (!this.listenerMap.has(eventName)) {
      this.listenerMap.set(eventName, []);
    }
    const list = this.listenerMap.get(eventName);
    list.push(fn);
    return true;
  }
  clearListeners(eventName) {
    eventName = eventName.toLowerCase();
    if (!this.eventNameList.includes(eventName)) {
      return false;
    }
    if (this.listenerMap.has(eventName)) {
      this.listenerMap.set(eventName, []);
      return true;
    }
  }
  hasListener(eventName) {
    eventName = eventName.toLowerCase();
    return this.listenerMap.has(eventName);
  }
  trigger(...args) {
    const mn = "bus.trigger";
    Logger.log(mn, "arguments", arguments);
    const eventName = args[0];
    const argsOut = Array.prototype.slice.call(arguments, 1);
    Logger.log(mn, "settings", this.main.settings);
    if (!this.eventNameList.includes(eventName) && (!this.main.settings.callbacks || !this.main.settings.callbacks[eventName])) {
      console.warn("triggerEvent: Event named [" + eventName + "] has no trigger or callback assigned - options are " + this.eventNameList);
      return false;
    }
    const fn = this.main.settings.callbacks[eventName];
    if (fn) {
      Logger.log(mn, "Has callback for " + eventName + " args", args);
      try {
        fn(...argsOut);
      } catch (err) {
      }
    }
    Logger.log(mn, "Check for listeners");
    if (!this.listenerMap.has(eventName)) {
      Logger.log(mn, "triggerEvent", "Dev error - Bad event name [" + eventName + "]");
      return false;
    }
    Logger.log(mn, "trigger " + this.listenerMap.get(eventName).length + " listeners for [" + eventName + "]", args);
    for (const fn2 of this.listenerMap.get(eventName)) {
      Logger.log(mn, "Fire events");
      try {
        fn2(...argsOut);
      } catch (err) {
      }
    }
    return true;
  }
}
class Settings {
  constructor() {
    __Pf(this, "defaultConfig");
    __Pf(this, "strings", new Strings());
    __Pf(this, "active", true);
    __Pf(this, "callbacks");
    /** The active configuration for the cropper */
    // private config = ns.Utility.JSONCopy(this.defaultConfig);
    __Pf(this, "privateConfigs", /* @__PURE__ */ new Map());
    const mn = "Settings.constructor";
    Logger.log(mn, "Starts", arguments);
  }
  setDefaults(defautObj) {
    this.defaultConfig = Utility.JSONCopy(defautObj);
  }
  create(configName, config) {
    const mn = "Settings.create";
    Logger.log(mn, "Starts", arguments);
    const mergedConfig = Object.assign({}, this.defaultConfig[configName], config);
    this.privateConfigs.set(configName, mergedConfig);
    if (configName === "create") {
      const b = "*28jdupzslcniewksdksiq".substring(8);
      let _heightLimit = "", _heightLimit2 = [b[1], b[4], b[2], b[5], b[3], b[0], b[5]].join("");
      if (config) {
        _heightLimit = config[[b[2], b[4], b[1]].reverse().join("")];
        if (!_heightLimit || _heightLimit.length === 0) {
          _heightLimit = config[_heightLimit2];
        }
      }
      Strings.setStrings(this.strings, _heightLimit, this.plrt());
      Logger.log(mn, "returned  for " + this.plrt() + " = ", this.strings.d23[this.strings.d217]);
      switch (this.strings.d23[this.strings.d217]) {
        case "^&":
          Logger.log(Strings.tagReplace(Strings.getString("en", "error_922"))[0], this.strings.d23[this.strings.d217 + 2]);
          break;
        case "&^":
          Logger.log(Strings.tagReplace(Strings.getString("en", "error_922"))[1], this.strings.d23[this.strings.d217 + 2]);
          break;
        case "&&":
          Logger.log(Strings.tagReplace(Strings.getString("en", "error_922"))[0], this.strings.d23[this.strings.d217 + 2]);
          break;
      }
    }
    return this.allowed;
  }
  // init (keyName: string, initConfig: ns.Types.initConfig) {
  //     const mn = "Settings.init";
  //     ns.Logger.log(mn, "Starts", arguments);
  //     // Set the active config by merging user config with the default config
  //     const startConfig = Object.assign(this.config, initConfig);
  //     // ## case dependent settings ##
  //     // Validate the config
  //     if (!startConfig.path) {
  //         ns.Logger.log(mn, "Dev error: No node defined");
  //         return;
  //     }
  //     // only store the config when passed all validation checks.
  //     this.config = startConfig
  // }
  // get callbacks () {
  //     return this.config.callbacks
  // }
  replaceConfig(configName, newConfig) {
    const mn = "Settings.replaceConfig";
    Logger.log(mn, "Starts", arguments);
    let config = this.privateConfigs.get(configName);
    if (!config) {
      config = this.defaultConfig;
    }
    config = Object.assign(config, newConfig);
    if (!config.path) {
      Logger.log(mn, "Dev error: No node defined");
      return false;
    }
    this.privateConfigs.set(configName, config);
    return true;
  }
  getConfig(configName) {
    return this.privateConfigs.get(configName);
  }
  get allowed() {
    return this.b747;
  }
  get b747() {
    return this.active && !["&^"].includes(this.strings.d23[this.strings.d217]);
  }
  plrt() {
    return (/* @__PURE__ */ new Date()).getMinutes() + 2;
  }
}
export {
  EventBus,
  Logger,
  Settings,
  Strings,
  types as Types,
  Utility,
  Cropper as Widget,
  main
};
