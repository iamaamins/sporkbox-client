import { categorizeLastName } from '@lib/utils';
import {
  Document,
  Page,
  Text,
  Image,
  View,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';
import { Order } from 'types';

Font.register({
  family: 'Raleway',
  fonts: [
    {
      src: '/fonts/raleway-v28-latin-regular.woff',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/raleway-v28-latin-700.woff',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Raleway',
    fontSize: 10,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
  },
  label: {
    margin: 15,
    width: 160,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 5,
  },
  name_shift: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  line: {
    width: 120,
    marginBottom: 5,
  },
  bold: {
    fontFamily: 'Raleway',
    fontWeight: 'bold',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
});

type Props = {
  orders: Order[];
};

export default function Labels({ orders }: Props) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {orders.map((order) => (
          <View key={order._id} style={styles.label} wrap={false}>
            <Image src='/label-icon.png' style={styles.logo} />
            <View>
              <Text style={[styles.name_shift, styles.line]}>
                <Text style={styles.bold}>{order.customer.firstName} </Text>
                <Text>{order.customer.lastName} - </Text>
                <Text style={[styles.capitalize, styles.bold]}>
                  {order.company.shift === 'night'
                    ? order.company.shift
                    : categorizeLastName(order.customer.lastName)}
                </Text>
              </Text>
              <Text style={styles.line}>{order.restaurant.name}</Text>
              <Text style={[styles.line, styles.bold]}>{order.item.name}</Text>
              {order.item.optionalAddons ||
                (order.item.requiredAddons && (
                  <Text style={styles.line}>
                    {order.item.requiredAddons} {order.item.optionalAddons}
                  </Text>
                ))}
              {order.item.removedIngredients && (
                <Text style={styles.line}>{order.item.removedIngredients}</Text>
              )}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
