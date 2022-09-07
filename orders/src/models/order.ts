import mongoose from "mongoose";

// An interface that are required to create a new Orders
interface OrdersAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describe the properties that a Orders Document has
interface OrdersDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// An interface that describe the properties that a Orders Model has
interface OrdersModel extends mongoose.Model<OrdersDoc> {
  build(attrs: OrdersAttrs): OrdersDoc;
}

const OrdersSchema = new mongoose.Schema({
  status: { type: String, required: true },
  expiresAt: { type: String, required: true },
  userId: { type: String, required: true },
  ticketId: { type: String, required: true },
},{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
})

OrdersSchema.pre('save', async function (done) {
  done();
})

OrdersSchema.statics.build = (attrs: OrdersAttrs) => {
  return new Orders(attrs);
}

const Orders = mongoose.model<OrdersDoc, OrdersModel>('Orders', OrdersSchema);

export { Orders };