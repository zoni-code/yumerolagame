webpackJsonp([0],{

/***/ 1022:
/*!*********************************!*\
  !*** ./src/scenes/PlayScene.ts ***!
  \*********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Indicators_1 = __webpack_require__(/*! ../objects/Indicators */ 1023);

var Player_1 = __webpack_require__(/*! ../objects/Player */ 1024);

var Monkey_1 = __webpack_require__(/*! ../objects/Monkey */ 1025);

var PlayScene =
/** @class */
function (_super) {
  __extends(PlayScene, _super);

  function PlayScene() {
    return _super.call(this, {
      key: "PlayScene"
    }) || this;
  }

  PlayScene.prototype.preload = function () {
    this.load.spritesheet("rola", "assets/rola.png", {
      frameWidth: 87,
      frameHeight: 62
    });
    this.load.image("taitai", "assets/taitai.png");
    this.load.image("monkey", "assets/monkey.png");
    this.load.image("oke", "assets/oke.png");
    this.load.image("bg", "assets/bg.png");
  };

  PlayScene.prototype.create = function () {
    this.physics.world.setBounds(20, -30, 320, 585);
    this.manager = new Manager(this);
  };

  PlayScene.prototype.update = function () {};

  return PlayScene;
}(Phaser.Scene);

var Manager =
/** @class */
function () {
  function Manager(scene) {
    var _this = this;

    this.scene = scene;
    this.firstMaxMonkeys = 1;
    this.secondMaxMonkeys = 10;
    this.monkeyDestroyed = 0;

    this.changeSetting = function (maxMonkeys) {
      _this.monkeyIndicator.setMaxMonkeys(maxMonkeys);
    };

    this.bindPlayerAndSomething = function (player, something) {
      _this.scene.physics.add.collider(_this.player.getSubstance(), something.getSubstance(), function () {
        _this.player.catch(something);
      });
    };

    this.bindMonkeyAndSomething = function (monkey, something) {
      _this.scene.physics.add.collider(monkey.getSubstance(), something.getSubstance(), function () {
        monkey.catch(something);
      });
    };

    this.init();
  }

  ;

  Manager.prototype.init = function () {
    var _this = this;

    this.scene.add.sprite(180, 320, "bg");
    this.player = new Player_1.Player(this.scene);
    this.lifeIndicator = new Indicators_1.LifeIndicator(this.scene, this.player.life);
    this.monkeyIndicator = new Indicators_1.MonkeyIndicator(this.scene, this.secondMaxMonkeys, this.monkeyDestroyed);
    this.startTime = new Date().getTime();
    this.elapsedTimeIndicator = new Indicators_1.ElapsedTimeIndicator(this.scene, this.startTime);
    this.taitaiIndicator = new Indicators_1.TaitaiIndicator(this.scene);
    this.scene.input.keyboard.on("keydown_SPACE", function (event) {
      _this.player.taitai = true;
    });
    this.scene.input.keyboard.on("keydown_LEFT", function (event) {
      _this.player.toLeft();
    });
    this.scene.input.keyboard.on("keyup_LEFT", function (event) {
      _this.player.stop();
    });
    this.scene.input.keyboard.on("keydown_RIGHT", function (event) {
      _this.player.toRight();
    });
    this.scene.input.keyboard.on("keyup_RIGHT", function (event) {
      _this.player.stop();
    });
    this.scene.input.on("pointerdown", function (pointer) {
      _this.isDragging = true;
      var thresholdX = _this.scene.sys.game.config["width"] / 2;
      var thresholdY = _this.scene.sys.game.config["height"] - 70;

      if (pointer.y > thresholdY) {
        _this.player.taitai = true;
      } else if (pointer.x < thresholdX) {
        _this.player.toLeft();
      } else {
        _this.player.toRight();
      }
    }, this);
    this.scene.input.on("pointerup", function (pointer) {
      _this.isDragging = false;

      _this.player.stop();
    }, this);
    this.scene.events.on("monkey_destroy"
    /* MONKEY_DESTROY */
    , function (monkey) {
      _this.monkeys[monkey.position] = null;
      _this.monkeyDestroyed++;

      _this.monkeyIndicator.setDestroyedMonkeys(_this.monkeyDestroyed);

      window.setTimeout(function () {
        if (_this.monkeyDestroyed === _this.firstMaxMonkeys) {// this.scene.physics.pause();
          // this.scene.events.emit(Events.GAME_STOP);
          // this.isPaused = true;
          // window.setTimeout(() => {
          //     this.changeSetting(this.secondMaxMonkeys);
          //     // TODO: 敵の数が増えた。おもしろいじゃない
          //     this.addMonkeyPosition();
          //     this.scene.physics.resume();
          //     this.scene.events.emit(Events.GAME_RESUME);
          //     this.isPaused = false;
          // }, 2000);
        }

        if (_this.monkeyDestroyed === _this.secondMaxMonkeys) {
          _this.toEnd(true);
        }
      }, 110);
    });
    this.scene.events.on("monkey_throw"
    /* MONKEY_THROW */
    , function (something) {
      _this.bindPlayerAndSomething(_this.player, something);
    });
    this.scene.events.on("player_bounced"
    /* PLAYER_BOUNCED */
    , function (something) {
      Object.keys(_this.monkeys).forEach(function (key) {
        var monkey = _this.monkeys[key];

        if (monkey) {
          _this.bindMonkeyAndSomething(_this.monkeys[key], something);
        }
      });
    });
    this.scene.events.on("player_life_changed"
    /* PLAYER_LIFE_CHANGED */
    , function (life) {
      _this.lifeIndicator.update(life);
    });
    this.scene.events.on("player_dead"
    /* PLAYER_DEAD */
    , function () {
      _this.toEnd(false);
    });
    this.scene.events.on("game_stop"
    /* GAME_STOP */
    , function () {
      _this.elapsedTimeIndicator.stop();
    });
    this.scene.events.on("game_resume"
    /* GAME_RESUME */
    , function () {
      _this.elapsedTimeIndicator.resume();
    });
    this.monkeys = (_a = {}, _a[MonkeyPosition.FRONT] = new Monkey_1.Monkey(this.scene, 1), _a[MonkeyPosition.CENTER] = new Monkey_1.Monkey(this.scene, 2), _a[MonkeyPosition.BACK] = new Monkey_1.Monkey(this.scene, 3), _a);
    this.initMonkey();
    this.startMonkeyInterval();

    var _a;
  };

  Manager.prototype.initMonkey = function () {
    var _this = this;

    Object.keys(this.monkeys).forEach(function (key) {
      _this.monkeys[key].init();
    });
  };

  Manager.prototype.startMonkeyInterval = function () {
    var _this = this;

    window.setInterval(function () {
      if (!_this.isPaused) {
        _this.createMonkey();
      }
    }, 1000);
  };

  Manager.prototype.createMonkey = function () {
    var _this = this;

    Object.keys(this.monkeys).forEach(function (key) {
      if (_this.monkeys[key] === null) {
        _this.monkeys[key] = new Monkey_1.Monkey(_this.scene, parseInt(key, 10));
        window.setTimeout(function () {
          _this.monkeys[key].init();
        }, 1000);
      }
    });
  };

  Manager.prototype.addMonkeyPosition = function () {
    this.monkeys = (_a = {}, _a[MonkeyPosition.FRONT] = new Monkey_1.Monkey(this.scene, 1), _a[MonkeyPosition.CENTER] = new Monkey_1.Monkey(this.scene, 2), _a[MonkeyPosition.BACK] = new Monkey_1.Monkey(this.scene, 3), _a);
    this.initMonkey();

    var _a;
  };

  Manager.prototype.toEnd = function (isClear) {
    this.scene.scene.start("EndScene", {
      isClear: isClear,
      elapsedTime: new Date().getTime() - this.startTime
    });
  };

  return Manager;
}();

var MonkeyPosition;

(function (MonkeyPosition) {
  MonkeyPosition[MonkeyPosition["FRONT"] = 1] = "FRONT";
  MonkeyPosition[MonkeyPosition["CENTER"] = 2] = "CENTER";
  MonkeyPosition[MonkeyPosition["BACK"] = 3] = "BACK";
})(MonkeyPosition = exports.MonkeyPosition || (exports.MonkeyPosition = {}));

exports.default = PlayScene;

/***/ }),

/***/ 1023:
/*!***********************************!*\
  !*** ./src/objects/Indicators.ts ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElapsedTimeIndicator =
/** @class */
function () {
  function ElapsedTimeIndicator(scene, startTime) {
    var _this = this;

    this.scene = scene;
    this.second = 0;

    this.stop = function () {
      window.clearTimeout(_this.timer);
    };

    this.resume = function () {
      _this.startTimer();
    };

    this.startTimer = function () {
      _this.timer = window.setInterval(function () {
        _this.second += 0.1;

        _this.substance.setText(_this.createString());
      }, 100);
    };

    this.createString = function () {
      return "TIME " + _this.second.toFixed(1);
    };

    this.substance = this.scene.add.text(10, 0, this.createString()).setColor("#000").setFontSize("12px");
    this.substance.setY(this.scene.sys.game.config["height"] - 7 - this.substance.height);
    this.substance.setDepth(1);
    this.startTimer();
  }

  ;
  return ElapsedTimeIndicator;
}();

exports.ElapsedTimeIndicator = ElapsedTimeIndicator;

var MonkeyIndicator =
/** @class */
function () {
  function MonkeyIndicator(scene, maxMonkeys, destroyedMonkeys) {
    var _this = this;

    this.scene = scene;

    this.setDestroyedMonkeys = function (destroyedMonkeys) {
      _this.destroyedMonkeys = destroyedMonkeys;

      _this.setText(_this.substance);
    };

    this.setMaxMonkeys = function (maxMonkeys) {
      _this.maxMonkeys = maxMonkeys;

      _this.setText(_this.substance);
    };

    this.setText = function (text) {
      return text.setText(_this.createString()).setColor("#000").setFontSize("12px");
    };

    this.createString = function () {
      return "SARU " + _this.destroyedMonkeys + "/" + _this.maxMonkeys;
    };

    this.maxMonkeys = maxMonkeys;
    this.destroyedMonkeys = destroyedMonkeys;
    this.substance = this.scene.add.text(10, 0, this.createString());
    this.substance.setY(this.scene.sys.game.config["height"] - 13 - this.substance.height * 2);
    this.substance.setDepth(1);
    this.setText(this.substance);
  }

  ;
  return MonkeyIndicator;
}();

exports.MonkeyIndicator = MonkeyIndicator;

var LifeIndicator =
/** @class */
function () {
  function LifeIndicator(scene, initialLife) {
    var _this = this;

    this.scene = scene;

    this.update = function (life) {
      _this.life = life;

      _this.substance.setColor("#000").setText(_this.createString());
    };

    this.createString = function () {
      return "LIFE " + _this.life;
    };

    this.life = initialLife;
    this.substance = this.scene.add.text(10, 10, this.createString()).setColor("#000").setFontSize("12px");
    this.substance.setY(this.scene.sys.game.config["height"] - 7 - this.substance.height * 2);
    this.substance.setDepth(1);
  }

  ;
  return LifeIndicator;
}();

exports.LifeIndicator = LifeIndicator;

var TaitaiIndicator =
/** @class */
function () {
  function TaitaiIndicator(scene) {
    this.scene = scene;
    this.substance = this.scene.add.sprite(this.scene.sys.game.config["width"] / 2, this.scene.sys.game.config["height"] - 30, "taitai");
    this.substance.setOrigin(0.5, 0.5).setInteractive();
  }

  ;
  return TaitaiIndicator;
}();

exports.TaitaiIndicator = TaitaiIndicator;

/***/ }),

/***/ 1024:
/*!*******************************!*\
  !*** ./src/objects/Player.ts ***!
  \*******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var Player =
/** @class */
function () {
  function Player(scene) {
    var _this = this;

    this.scene = scene;
    this.life = 3;

    this.catch = function (something) {
      if (_this.isTaitai) {
        _this.bounce(something);
      } else {
        _this.getDamage(something);
      }
    };

    this.bounce = function (something) {
      var diff = _this.substance.x - something.getSubstance().x;
      something.getSubstance().setVelocityY(-900);
      something.getSubstance().setVelocityX(-diff);
      something.isBounced = true;

      _this.scene.events.emit("player_bounced"
      /* PLAYER_BOUNCED */
      , something);
    };

    this.getDamage = function (something) {
      _this.life -= something.damage;
      something.destroy();

      if (_this.life === 0) {
        _this.scene.events.emit("player_dead"
        /* PLAYER_DEAD */
        );
      } else {
        _this.scene.events.emit("player_life_changed"
        /* PLAYER_LIFE_CHANGED */
        , _this.life);
      }
    };

    this.toRight = function () {
      _this.substance.setVelocityX(400);
    };

    this.toLeft = function () {
      _this.substance.setVelocityX(-400);
    };

    this.stop = function () {
      _this.substance.setVelocityX(0);
    };

    this.getSubstance = function () {
      return _this.substance;
    };

    this.substance = scene.physics.add.sprite(this.scene.sys.game.config["width"] / 2, 525, "rola");
    this.substance.setOrigin(0.5, 0.5);
    this.substance.setBounce(0);
    this.substance.setCollideWorldBounds(true);
    this.scene.anims.create({
      key: 'taitai',
      frames: this.scene.anims.generateFrameNumbers('rola', {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: 1
    });
    this.scene.anims.create({
      key: 'stop',
      frames: [{
        key: 'rola',
        frame: 0
      }],
      frameRate: 20
    });
  }

  ;
  Object.defineProperty(Player.prototype, "taitai", {
    get: function get() {
      return this.isTaitai;
    },
    set: function set(value) {
      var _this = this;

      this.isTaitai = value;

      if (this.isTaitai) {
        window.clearTimeout(this.taitaiTimer);
        this.substance.anims.play("taitai");
        this.taitaiTimer = window.setTimeout(function () {
          _this.substance.anims.play("stop");

          _this.isTaitai = false;
        }, 500);
      }
    },
    enumerable: true,
    configurable: true
  });
  return Player;
}();

exports.Player = Player;

/***/ }),

/***/ 1025:
/*!*******************************!*\
  !*** ./src/objects/Monkey.ts ***!
  \*******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var Something_1 = __webpack_require__(/*! ./Something */ 1026);

var Monkey =
/** @class */
function () {
  function Monkey(scene, position) {
    var _this = this;

    this.scene = scene;
    this.position = position;
    this.gameWidth = parseInt(this.scene.sys.game.config["width"], 10);

    this.init = function () {
      _this.substance.visible = true;

      _this.substance.setY(95 + _this.substance.height * (_this.position * 0.75) - _this.substance.height / 2);

      _this.substance.setAlpha(0.8);

      _this.substance.setBounce(0);

      _this.substance.setCollideWorldBounds(true);

      _this.substance.body.onWorldBounds = true;
      _this.moveTimer = window.setInterval(function () {
        _this.moveRandom();
      }, 100 + Math.random() * 500);
      window.setTimeout(function () {
        _this.throwInterval();
      }, 2000 + Math.random() * 500);

      _this.moveRandom();
    };

    this.catch = function (something) {
      if (something.isBounced) {
        something.destroy();

        _this.destroy();
      }
    };

    this.throw = function () {
      var something = new Something_1.Something(_this.scene, _this.substance.x, _this.substance.y, _this.substance.height);

      _this.scene.events.emit("monkey_throw"
      /* MONKEY_THROW */
      , something);

      if (_this.substance) {
        _this.substance.setVelocityX(0);
      }
    };

    this.moveRandom = function () {
      _this.substance.setVelocityX(2 * (_this.gameWidth * Math.random() - _this.gameWidth / 2));
    };

    this.destroy = function () {
      window.clearInterval(_this.moveTimer);
      window.clearTimeout(_this.throwTimer);

      _this.substance.destroy();

      _this.scene.events.emit("monkey_destroy"
      /* MONKEY_DESTROY */
      , _this);
    };

    this.getSubstance = function () {
      return _this.substance;
    };

    this.throwInterval = function () {
      if (Math.random() < 0.5) {
        _this.throw();
      }

      _this.throwTimer = window.setInterval(function () {
        window.clearInterval(_this.throwTimer);

        _this.throwInterval();
      }, 1000 + Math.random() * 500);
    };

    this.substance = scene.physics.add.sprite(this.gameWidth * Math.random(), 0, "monkey");
    this.substance.visible = false;
  }

  ;
  return Monkey;
}();

exports.Monkey = Monkey;

/***/ }),

/***/ 1026:
/*!**********************************!*\
  !*** ./src/objects/Something.ts ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var Something =
/** @class */
function () {
  function Something(scene, initialX, initialY, monkeyHeight) {
    var _this = this;

    this.scene = scene;
    this.damage = 0.5;
    this.isBounced = false;

    this.destroy = function () {
      _this.substance.destroy();

      window.clearInterval(_this.destoryTimer);

      _this.scene.events.emit("something_destroy"
      /* SOMETHING_DESTROY */
      , _this);
    };

    this.getSubstance = function () {
      return _this.substance;
    };

    this.substance = scene.physics.add.sprite(initialX, initialY + monkeyHeight, "oke");
    this.substance.setVelocityY(400);
    this.substance.setVelocityX(100 * Math.random() - 50);
    this.substance.setZ(200);
    this.destoryTimer = window.setInterval(function () {
      if (_this.substance.x < -50 || _this.substance.x > 700 || _this.substance.y < -50 || _this.substance.y > 700) {
        _this.destroy();
      }
    }, 3000);
  }

  ;
  return Something;
}();

exports.Something = Something;

/***/ }),

/***/ 1027:
/*!********************************!*\
  !*** ./src/scenes/EndScene.ts ***!
  \********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TwitterUtil_1 = __webpack_require__(/*! ../utils/TwitterUtil */ 1028);

var EndScene =
/** @class */
function (_super) {
  __extends(EndScene, _super);

  function EndScene() {
    return _super.call(this, {
      key: "EndScene"
    }) || this;
  }

  EndScene.prototype.preload = function () {
    this.load.image("mushroom", "assets/sprites/mushroom.png");
  };

  EndScene.prototype.create = function () {
    this.add.text(10, 20, "クリア").setColor("#000").setInteractive();
    var tweetButton = this.add.text(100, 200, "ツイート").setColor("#000").setInteractive();
    tweetButton.on('pointerdown', function () {
      TwitterUtil_1.default.openTweetWindow(this.isClear, this.time);
    });
  };

  return EndScene;
}(Phaser.Scene);

exports.default = EndScene;

/***/ }),

/***/ 1028:
/*!**********************************!*\
  !*** ./src/utils/TwitterUtil.ts ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var TwitterUtil =
/** @class */
function () {
  function TwitterUtil() {}

  TwitterUtil.openTweetWindow = function (isClear, time) {
    var url = TwitterUtil.baseUrl + this.createText(isClear, time) + "&url=" + encodeURI(this.targetUrl);
    window.open(url, "tweet", 'width=650, height=470');
  };

  TwitterUtil.createText = function (isClear, time) {
    return (isClear ? "クリア" : "失敗") + " " + time;
  };

  TwitterUtil.baseUrl = "http://twitter.com/share?text=";
  TwitterUtil.targetUrl = "http://www.example.com";
  return TwitterUtil;
}();

exports.default = TwitterUtil;

/***/ }),

/***/ 1029:
/*!**********************************!*\
  !*** ./src/scenes/StartScene.ts ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StartScene =
/** @class */
function (_super) {
  __extends(StartScene, _super);

  function StartScene() {
    var _this = _super.call(this, {
      key: "StartScene"
    }) || this;

    _this.toPlayScence = function () {
      _this.input.off("pointerdown", _this.toPlayScence, _this, null);

      _this.input.keyboard.off("keydown_SPACE", _this.toPlayScence, null, null);

      _this.scene.start("PlayScene");
    };

    return _this;
  }

  StartScene.prototype.preload = function () {
    this.load.image("bg", "assets/bg.png");
  };

  StartScene.prototype.create = function () {
    var _this = this;

    this.add.sprite(180, 320, "bg");
    document.querySelector('#content').addEventListener('click', function () {
      var canvas = _this.sys.game.canvas;
      var fullscreen = _this.sys.game.device.fullscreen;
      canvas[fullscreen.request]();
    });
    this.input.on("pointerdown", this.toPlayScence, this);
    this.input.keyboard.on("keydown_SPACE", this.toPlayScence);
  };

  return StartScene;
}(Phaser.Scene);

exports.default = StartScene;

/***/ }),

/***/ 409:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/yoshikawa/repository/phaser3-typescript-webpack/src/main.ts */410);


/***/ }),

/***/ 410:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(/*! phaser */ 190);

var PlayScene_1 = __webpack_require__(/*! ./scenes/PlayScene */ 1022);

var EndScene_1 = __webpack_require__(/*! ./scenes/EndScene */ 1027);

var StartScene_1 = __webpack_require__(/*! ./scenes/StartScene */ 1029);

var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 360,
  height: 640,
  resolution: 1,
  backgroundColor: "#EDEEC9",
  scene: [StartScene_1.default, PlayScene_1.default, EndScene_1.default],
  physics: {
    default: 'arcade'
  }
};
new Phaser.Game(config);

/***/ })

},[409]);
//# sourceMappingURL=bundle.js.map