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
    fontSize: 12,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
  },
  label: {
    margin: 5,
    width: '31.5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  name_shift: {
    flexDirection: 'row',
  },
  line: {
    flexGrow: 1,
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
          <View key={order._id} style={styles.label}>
            <Image src='/label-icon.png' style={styles.logo} />
            <View>
              <View style={[styles.name_shift, styles.line]}>
                <Text style={styles.bold}>{order.customer.firstName} </Text>
                <Text>{order.customer.lastName} - </Text>
                <Text style={styles.capitalize}>
                  {order.company.shift === 'night'
                    ? order.company.shift
                    : categorizeLastName(order.customer.lastName)}
                </Text>
              </View>
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