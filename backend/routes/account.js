const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const router = express.Router();

router.get('/balance', authMiddleware, async(req, res) => {
   const userId = req.userId;
   const accountDetails = await Account.findOne({ userId: userId});
   res.status(200).json({
    balance: accountDetails.balance
   })
})

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await Account.startSession();
    session.startTransaction();
    try {
        const { to, amount } = req.body;
        const userId = req.userId;

        const senderAccount = await Account.findOne({ userId: userId }).session(session);
        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        await Account.updateOne(
            { userId: userId },
            { $inc: { balance: -amount } },
            { session }
        );

        const receiverAccount = await Account.findOne({ userId: ObjectId(to) }).session(session);
        if (!receiverAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Invalid recipient account' });
        }

        await Account.updateOne(
            { userId: ObjectId(to) },
            { $inc: { balance: amount } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error transferring money:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router