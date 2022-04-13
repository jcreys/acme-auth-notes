const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const config = {
  logging: false
};

if(process.env.LOGGING){
  delete config.logging;
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db', config);

const User = conn.define('user', {
  username: STRING,
  password: STRING
});
//added note model
const Note = conn.define('note', {
  text: STRING
})

Note.belongsTo(User);
User.hasMany(Note);


User.addHook('beforeSave', async(user)=> {
  if(user.changed('password')){
    const hashed = await bcrypt.hash(user.password, 3);
    user.password = hashed;
  }
});

User.byToken = async(token)=> {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(payload.id, {
      attributes: {
        exclude: ['password']
      }
    });
    if(user){
      return user;
    }
    
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  catch(ex){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
};

User.authenticate = async({ username, password })=> {
  const user = await User.findOne({
    where: {
      username
    }
  });
  if(user && await bcrypt.compare(password, user.password) ){
    return jwt.sign({ id: user.id}, process.env.JWT); 
  }
  const error = Error('bad credentials!!!!!!');
  error.status = 401;
  throw error;
};

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const credentials = [
    { username: 'lucy', password: 'lucy_pw'},
    { username: 'moe', password: 'moe_pw'},
    { username: 'larry', password: 'larry_pw'}
  ];
  const notes = [
    {text: 'hello world'},
    {text: 'lorem ipsum'},
    {text: 'test text'}
  ];

  const [note1, note2, note3] = await Promise.all(
    notes.map( note => Note.create(note))
  );
  const [lucy, moe, larry] = await Promise.all(
    credentials.map( credential => User.create(credential))
  );
  // await lucy.setNotes(note1);
  // await moe.setNotes([note2, note3]);


  note1.userId = lucy.id;
  note2.userId = moe.id;
  note3.userId = larry.id;

  await Promise.all([
    note1.save(),
    note2.save(),
    note3.save()
  ])
  // console.log(note1);
  return {
    users: {
      lucy,
      moe,
      larry
    }
  };
};



module.exports = {
  syncAndSeed,
  models: {
    User,
    Note
  }
};
