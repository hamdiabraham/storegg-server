const PlayerModel = require("../models/playerModel");
const path = require("path");
const fs = require("fs");
const config = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class Auth {
  static async signup(req, res, next) {
    try {
      const payload = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(targetPath);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            const player = new PlayerModel({ ...payload, avatar: filename });
            await player.save();

            delete player._doc.password;

            res.status(201).json({ data: player });
          } catch (err) {
            if (err && err.name === "ValidationError") {
              return res.status(422).json({
                error: 1,
                message: err.message,
                fields: err.errors,
              });
            }
          }
        });
      } else {
        let player = new PlayerModel(payload);
        await player.save();
        delete player._doc.password;

        res.status(201).json({ data: player });
      }
    } catch (err) {
      if (err && err.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next();
    }
  }

  static signin(req, res, next) {
    const { email, password } = req.body;

    PlayerModel.findOne({ email: email })
      .then((player) => {
        if (player) {
          const correctPassword = bcrypt.compareSync(password, player.password);
          if (correctPassword) {
            const token = jwt.sign(
              {
                player: {
                  id: player.id,
                  username: player.username,
                  email: player.email,
                  name: player.name,
                  phoneNumber: player.phoneNumber,
                  avatar: player.avatar,
                },
              },
              config.jwtKey
            );

            res.status(200).json({
              data: { token },
            });
          } else {
            res.status(403).json({
              message: `Invalid Email and password!!`,
            });
          }
        } else {
          res.status(403).json({
            message: `Your email is not registered`,
          });
        }
      })
      .catch((err) => {
        res.status(403).json({
          message: err.message,
        });

        next();
      });
  }
}

module.exports = Auth;
