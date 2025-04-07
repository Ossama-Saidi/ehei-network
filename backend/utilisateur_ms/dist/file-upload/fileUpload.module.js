"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadModule = void 0;
const common_1 = require("@nestjs/common");
const FileUploadService_1 = require("./FileUploadService");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const serve_static_1 = require("@nestjs/serve-static");
let FileUploadModule = class FileUploadModule {
};
exports.FileUploadModule = FileUploadModule;
exports.FileUploadModule = FileUploadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path.join(__dirname, '..', 'public'),
            }),
            ,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, cb) => {
                        const uploadDir = path.join(__dirname, '..', 'uploads');
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }
                        cb(null, uploadDir);
                    },
                    filename: (req, file, cb) => {
                        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                        const fileExtension = path.extname(file.originalname);
                        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
                    },
                }),
                limits: {
                    fileSize: 10 * 1024 * 1024,
                },
            }),
        ],
        providers: [FileUploadService_1.FileUploadService],
        exports: [FileUploadService_1.FileUploadService],
    })
], FileUploadModule);
//# sourceMappingURL=fileUpload.module.js.map