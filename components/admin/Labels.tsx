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
    fontSize: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 22,
    paddingBottom: 14,
    paddingHorizontal: 10,
    fontFamily: 'Raleway',
    backgroundColor: '#ffffff',
  },
  label: {
    width: 188,
    border: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 13,
    marginHorizontal: 4.5,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
  name_shift: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 10,
  },
  line: {
    width: 151,
  },
  bold: {
    fontWeight: 'bold',
    fontFamily: 'Raleway',
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
      <Page size='LETTER' style={styles.page}>
        {orders.map((order) => (
          <View key={order._id} style={styles.label} wrap={false}>
            <Image src='/label-icon.png' style={styles.logo} />
            <View>
              <View style={[styles.name_shift, styles.line]}>
                <Text style={styles.bold}>{order.customer.firstName} </Text>
                <Text>{order.customer.lastName} - </Text>
                <Text style={[styles.capitalize, styles.bold]}>
                  {order.company.shift === 'night'
                    ? order.company.shift
                    : categorizeLastName(order.customer.lastName)}
                </Text>
              </View>
              <Text style={styles.line}>{order.restaurant.name}</Text>
              <Text style={[styles.line, styles.bold]}>{order.item.name}</Text>
              {(order.item.optionalAddons || order.item.requiredAddons) && (
                <Text style={styles.line}>
                  {order.item.requiredAddons} {order.item.optionalAddons}
                </Text>
              )}
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
