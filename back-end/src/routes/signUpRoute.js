import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';
import { awsUserPool } from '../util/awsUserPool';
 import sqldb from '../sqldb';
import DbService from '../sqldb';
export const signUpRoute = {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;

        const attributes = [
            new CognitoUserAttribute({ Name: 'email', Value: email }),
        ];

        awsUserPool.signUp(email, password, attributes, null, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Unable to sign up user' });
            }

            const db = getDbConnection('users');

            const startingInfo = {
                hairColor: '',
                favoriteFood: '',
                bio: '',
            };

//-----sqldb
                    const dbs=DbService.getDbServiceInstance();
                     const dbresult=await dbs.saveSignUp(email,false,startingInfo.favoriteFood,startingInfo.hairColor,startingInfo.bio);

            const result = await db.collection('users').insertOne({
                email,
                info: startingInfo,
            });
            const { insertedId } = result;

            jwt.sign({
                id: insertedId,
                isVerified: false,
                email,
                info: startingInfo,
            },
                process.env.JWT_SECRET,
                {
                    expiresIn: '2d',
                },
                (err, token) => {
                    if (err) return res.sendStatus(500);
                    res.status(200).json({ token });
                })
        });
    }
}