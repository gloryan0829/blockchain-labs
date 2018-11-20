webpackHotUpdate("static/development/pages/campaigns/requests.js",{

/***/ "./components/RequestRow.js":
/*!**********************************!*\
  !*** ./components/RequestRow.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
/* harmony import */ var _contracts_web3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contracts/web3 */ "./contracts/web3.js");
/* harmony import */ var _contracts_campaign__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contracts/campaign */ "./contracts/campaign.js");


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var RequestRow =
/*#__PURE__*/
function (_Component) {
  _inherits(RequestRow, _Component);

  function RequestRow(props) {
    var _this;

    _classCallCheck(this, RequestRow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RequestRow).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onApprove",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      var campaign, accounts;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({
                loading: true
              });

              campaign = Object(_contracts_campaign__WEBPACK_IMPORTED_MODULE_4__["default"])(_this.props.address);
              _context.next = 4;
              return _contracts_web3__WEBPACK_IMPORTED_MODULE_3__["default"].eth.getAccounts();

            case 4:
              accounts = _context.sent;
              _context.next = 7;
              return campaign.methods.approveRequest(_this.props.id).send({
                from: accounts[0]
              });

            case 7:
              _this.setState({
                loading: false
              });

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onFinalize",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
      var campaign, accounts;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _this.setState({
                loading: true
              });

              campaign = Object(_contracts_campaign__WEBPACK_IMPORTED_MODULE_4__["default"])(_this.props.address);
              _context2.next = 4;
              return _contracts_web3__WEBPACK_IMPORTED_MODULE_3__["default"].eth.getAccounts();

            case 4:
              accounts = _context2.sent;
              _context2.next = 7;
              return campaign.methods.finalizeRequest(_this.props.id).send({
                from: accounts[0]
              });

            case 7:
              _this.setState({
                loading: false
              });

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));

    _this.state = {
      loading: false
    };
    return _this;
  }

  _createClass(RequestRow, [{
    key: "render",
    value: function render() {
      var Row = semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Table"].Row,
          Cell = semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Table"].Cell;
      console.log(this.props);
      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Row, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Cell, null, this.props.id + 1), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Cell, null, this.props.request.description), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Cell, null, _contracts_web3__WEBPACK_IMPORTED_MODULE_3__["default"].utils.fromWei(this.props.request.value, 'ether'), " ETH"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Cell, null, this.props.request.recipient), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Cell, null, this.props.request.approvalCount, " / ", this.props.approversCount), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Cell, null, this.props.request.complete ? null : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Button"], {
        color: "green",
        basic: true,
        loading: this.state.loading,
        onClick: this.onApprove
      }, "\uC2B9\uC778")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Cell, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Button"], {
        color: "red",
        basic: true,
        loading: this.state.loading,
        onClick: this.onFinalize
      }, "\uCD9C\uAE08\uD558\uAE30")));
    }
  }]);

  return RequestRow;
}(react__WEBPACK_IMPORTED_MODULE_1__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (RequestRow);

/***/ })

})
//# sourceMappingURL=requests.js.c9c0e4cf189deb8eedb7.hot-update.js.map