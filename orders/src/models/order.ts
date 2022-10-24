import mongoose from "mongoose";
import { OrderStatus } from "@yootick/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

// An interface that are required to create a new Orders
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describe the properties that a Orders Document has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describe the properties that a Orders Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created },
  expiresAt: { type: mongoose.Schema.Types.Date },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
},{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
})

OrderSchema.pre('save', async function (done) {
  done();
})

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };