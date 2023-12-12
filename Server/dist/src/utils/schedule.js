"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const audio_1 = __importDefault(require("../models/audio"));
const autoGeneratedPlaylist_1 = __importDefault(require("../models/autoGeneratedPlaylist"));
const node_cron_1 = __importDefault(require("node-cron"));
const generatedPlaylist = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield audio_1.default.aggregate([
        { $sort: { likes: -1 } },
        {
            $sample: { size: 20 },
        },
        {
            $group: {
                _id: "$category",
                audios: { $push: "$$ROOT._id" }
            }
        },
    ]);
    result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        yield autoGeneratedPlaylist_1.default.updateOne({ title: item._id }, { $set: { items: item.audios } }, { upsert: true });
    }));
});
node_cron_1.default.schedule(" 0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield generatedPlaylist();
}));
