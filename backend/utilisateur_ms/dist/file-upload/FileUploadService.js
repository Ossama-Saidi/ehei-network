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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let FileUploadService = class FileUploadService {
    constructor(configService) {
        this.configService = configService;
        this.uploadDir = path.join(__dirname, '..', 'uploads');
        this.baseUrl = this.configService.get('APP_URL') || 'http://localhost:3001/uploads';
    }
    async uploadFile(file, subfolder) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        this.validateFile(file);
        const uploadDir = this.getUploadDirectory(subfolder);
        const uniqueFileName = this.generateUniqueFileName(file);
        const filePath = path.join(uploadDir, uniqueFileName);
        await fs.promises.writeFile(filePath, file.buffer);
        return `${this.baseUrl}/${subfolder}/${uniqueFileName}`;
    }
    validateFile(file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new common_1.BadRequestException('File too large. Maximum size is 10MB.');
        }
    }
    getUploadDirectory(subfolder) {
        const dir = path.join(this.uploadDir, subfolder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return dir;
    }
    generateUniqueFileName(file) {
        const ext = path.extname(file.originalname);
        return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}${ext}`;
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileUploadService);
//# sourceMappingURL=FileUploadService.js.map