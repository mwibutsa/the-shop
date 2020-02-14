import moment from "moment";
class Order {
  constructor(id, items, totalAmount, date) {
    this.id = id;
    this.items = items;
    this.date = date;
    this.totalAmount = totalAmount;
  }

  get readabledate() {
    // return this.date.toLocaleDateString("en-EN", {
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit"
    // });

    return moment(this.date).format("MMM Do YYYY, hh:mm");
  }
}

export default Order;
