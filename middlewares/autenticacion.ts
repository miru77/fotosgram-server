import { Request, NextFunction, Response } from "express";
import Token from '../clases/token';


export const verificatoken = (req: any, res: Response, next: NextFunction) => {

        const userToken = req.get('x-token') || '';

        Token.comprobarToken(userToken)
        .then( (decoded: any) => {
            
            console.log('Decoded',decoded);
            req.usuario = decoded.usuario;
            next();
        })
        .catch(err => {

            res.json({
                ok: false,
                mensaje: 'token no es correcto'
            });
        });
        
}