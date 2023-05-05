import { IOrderData, ICompany, ICustomer, IOrdersGroup } from "types";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";

// Order headers
export const orderHeaders = [
  {
    label: "Delivery date",
    key: "deliveryDate",
  },
  {
    label: "Company",
    key: "companyName",
  },
  {
    label: "Shift",
    key: "shift",
  },
  {
    label: "First name",
    key: "firstName",
  },
  {
    label: "Last name",
    key: "lastName",
  },
  {
    label: "Email",
    key: "customerEmail",
  },
  {
    label: "Restaurant",
    key: "restaurantName",
  },
  {
    label: "Item",
    key: "itemName",
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Dietary Tags",
    key: "tags",
  },
  {
    label: "Added ingredients",
    key: "addedIngredients",
  },
  {
    label: "Removed ingredients",
    key: "removedIngredients",
  },
  {
    label: "Description",
    key: "description",
  },
  {
    label: "Price",
    key: "price",
  },
];

// Order file name
export const orderFileName = (ordersGroup: IOrdersGroup) =>
  `${ordersGroup.company.name} - ${ordersGroup.deliveryDate.split("T")[0]}.csv`;

// Order data
export const orderData = (ordersGroup: IOrdersGroup) =>
  ordersGroup.orders.reduce((acc, curr) => {
    // Create order
    const order = {
      tags: curr.item.tags,
      price: curr.item.total,
      itemName: curr.item.name,
      quantity: curr.item.quantity,
      companyName: curr.company.name,
      lastName: curr.customer.lastName,
      customerEmail: curr.customer.email,
      description: curr.item.description,
      firstName: curr.customer.firstName,
      restaurantName: curr.restaurant.name,
      addedIngredients: curr.item.addedIngredients,
      removedIngredients: curr.item.removedIngredients,
      deliveryDate: convertDateToText(curr.delivery.date),
      shift: `${curr.company.shift[0].toUpperCase()}${curr.company.shift.slice(
        1
      )}`,
    };

    if (order.quantity === 1) {
      // Format price and add order to acc
      return [...acc, { ...order, price: formatCurrencyToUSD(order.price) }];
    } else {
      // Create orders array
      let orders = [];

      // Loop through quantity, create an order
      // for each quantity and add the item to the orders array
      for (let i = 0; i < order.quantity; i++) {
        orders.push({
          ...order,
          quantity: 1,
          price: formatCurrencyToUSD(order.price / order.quantity),
        });
      }

      // Return the acc with created orders
      return [...acc, ...orders];
    }
  }, [] as IOrderData[]);

// Customer header
export const customerHeaders = [
  {
    label: "First Name",
    key: "firstName",
  },
  {
    label: "Last Name",
    key: "lastName",
  },
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Status",
    key: "status",
  },
];

// Customer file name
export const customerFileName = (company: ICompany) =>
  `Customer info - ${
    company.name
  } - ${company.shift[0].toUpperCase()}${company.shift.slice(1)} shift`;

// Customer data
export const customerData = (customers: ICustomer[]) =>
  customers.map((customer) => ({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    status: customer.status,
  }));