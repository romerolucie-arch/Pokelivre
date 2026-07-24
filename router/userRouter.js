import { Router } from "express"
import { prisma } from "../db.js"
import { hash, compare } from "bcrypt"
import { authGuard } from "../middleware/authGuard.js"
import UserSchema from "../validation/userValidation.js"


const userRouter = Router ()

userRouter.get("/subscribe", (req, res) => {
    res.render("pages/subscribe.twig", {
        title: "Inscription",
    })
})

userRouter.post("/subscribe", async (req,res)=>{
    try {
        const result = UserSchema.parse(req.body)
        const hashPassword = await hash(req.body.password, parseInt(process.env.SALT))
        console.log(prisma.user);
        const user = await prisma.user.create({
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                username: req.body.username,
                password: hashPassword
            }
        })
        res.redirect("/login")
    } catch (error) {
        res.send("pas bon")
        console.log(error);
        
    }
})

userRouter.get("/login", (req,res)=>{
    res.render("pages/login.twig")
})

userRouter.post("/login", async(req,res)=>{
    try {
        const user = await prisma.user.findUnique({
            where : {
                username: req.body.username
            }
        })
        if (!user) {
            throw new Error("identifiants invalides")
        }
        if (!await compare(req.body.password, user.password)) {
            throw new Error("Mot de passe incorrect");
        }
        req.session.userId = user.id
        res.redirect("/dashboard")
        
    } catch (error) {
        console.log(error)
         res.render("pages/login.twig", {
            error: error.message
         })
    }
})

userRouter.get('/dashboard', authGuard, async(req,res)=>{
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(req.session.userId)
        },
        include: {
            books:true,
        }
    })
    res.render('pages/dashboard.twig', {
        userLogged: req.userLogged,
        user: user
    })
})

userRouter.post('logout', (req,res)=>{
    req.session.destroy();
    res.redirect ("/login")
})

export default userRouter