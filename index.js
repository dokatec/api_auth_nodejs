import express from 'express';
import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

main().catch(err => {
    console.log(err);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/auth-db');

}

const app = express();
app.use(express.json());
const port = 3000;

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const newUser = new user({
        name,
        email,
        password
    });

    try {
        await newUser.save();
        res.json({ msg: "Usuario registrado com sucesso" });

    } catch (err) {
        console.error(err.message);
        res.status(400).json({ errors: [{ msg: err.message }] });

    }

});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                errors: [{ msg: "Usuario não encontrado" }]
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                errors: [{ msg: 'Senha Invalida' }]
            })
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'yoursecretkey', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => console.log(`Server started on port ${port}`));





