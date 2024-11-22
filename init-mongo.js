db = connect("mongodb://localhost:27017/kondakov");

db.createCollection("personnel");

db.your_collection_name.insertMany([
  {
    _id: ObjectId("672283c99e99301b7944f280"),
    responsible_person: "Іван Петров",
    rank: "солдат",
    stressLevel: 4,
    serviceSatisfaction: 9,
    workLifeBalance: 5
  },
  {
    _id: ObjectId("672531ba4462f923e8aba419"),
    responsible_person: "Петро Іванов",
    rank: "сержант",
    stressLevel: 6,
    serviceSatisfaction: 3,
    workLifeBalance: 5
  }
]);
