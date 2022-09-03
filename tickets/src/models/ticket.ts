import mongoose from "mongoose";

// An interface that are required to create a new Tickets
interface TicketsAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describe the properties that a Tickets Document has
interface TicketsDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// An interface that describe the properties that a Tickets Model has
interface TicketsModel extends mongoose.Model<TicketsDoc> {
  build(attrs: TicketsAttrs): TicketsDoc;
}

const TicketsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  userId: { type: String, required: true },
},{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

TicketsSchema.pre('save', async function (done) {
  done();
})

TicketsSchema.statics.build = (attrs: TicketsAttrs) => {
  return new Tickets(attrs);
}

const Tickets = mongoose.model<TicketsDoc, TicketsModel>('Tickets', TicketsSchema);

export { Tickets };