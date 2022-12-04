import { connectDatabase, insertDocument } from '../../helpers/db-util';

async function handler(req, res) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid email address.' });
      return;
    }

    let client;

    try {
      client = await connectDatabase();
    } catch (err) {
      res.status(500).json({ message: 'Connecting to the database failed!' });
      return;
    }

    try {
      await insertDocument(client, 'newsletter', { email: userEmail });
      client.close(); // 여러개의 몽고 클라이언트 객체를 만들었을 경우에는 close()를 명시적으로 호출
    } catch (err) {
      res.status(500).json({ message: 'Inserting data failed' });
      console.log(err);
    }

    res.status(201).json({ message: 'Signed up!' });
  }
}

export default handler;
