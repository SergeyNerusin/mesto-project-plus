import { Request, Response } from 'express';
import { ITestRequest } from '../middleware/middleware';
import Users from '../models/user';

const getUsers = async (req: Request, res: Response) => {
  console.log('req.params', req.params);
  const { _id } = req.params;
  if (!_id) {
    try {
      const users = await Users.find({});
      return res.send({ data: users });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
  try {
    const user = await Users.findById(_id);
    return res.send({ data: user });
  } catch (err) {
    return res.status(401).send({ massage: err });
  }
};

const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await Users.create({ name, about, avatar });
    return res.send({ data: user });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

const updateAboutMe = async (req: ITestRequest, res: Response) => {
  const path = req.originalUrl;
  const _id = req.user?._id;
  if (path === '/users/me') {
    try {
      const { name, about } = req.body;
      const user = await Users.findByIdAndUpdate(
        _id,
        { name, about },
        { new: true, runValidators: true },
      );
      return res.send({ data: user });
    } catch (err) {
      return res.send({ messsage: err });
    }
  }

  try {
    const { avatar } = req.body;
    const user = await Users.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.send({ data: user });
  } catch (err) {
    return res.send({ message: err });
  }
};

export { getUsers, createUser, updateAboutMe };
