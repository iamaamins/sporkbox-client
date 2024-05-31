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
    height: 59,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 13,
    marginHorizontal: 4.5,
    border: 1,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
  name_shift: {
    marginBottom: 10,
    flexDirection: 'row',
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
  function calculateFontSize(
    text: string,
    maxWidth: number,
    baseFontSize = 10
  ) {
    const charWidth = baseFontSize * 0.6;
    const textWidth = text.length * charWidth;
    if (textWidth <= maxWidth) return baseFontSize;
    return maxWidth / text.length / 0.6;
  }

  return (
    <Document>
      <Page size='LETTER' style={styles.page}>
        {orders.map((order) => {
          const nameShift = `${order.customer.firstName} ${
            order.customer.lastName
          } - ${
            order.company.shift === 'night'
              ? order.company.shift
              : categorizeLastName(order.customer.lastName)
          }`;
          const smallerFontSize =
            (order.item.optionalAddons ||
              order.item.requiredAddons ||
              order.item.removedIngredients) &&
            6;
          const smallestFontSize = Math.min(
            smallerFontSize || calculateFontSize(nameShift, styles.line.width)
          );

          return (
            <View key={order._id} style={styles.label} wrap={false}>
              <Image src='/label-icon.png' style={styles.logo} />
              <View>
                <View style={[styles.name_shift, styles.line]}>
                  <Text style={[styles.bold, { fontSize: smallestFontSize }]}>
                    {order.customer.firstName}{' '}
                  </Text>
                  <Text style={{ fontSize: smallestFontSize }}>
                    {order.customer.lastName} -{' '}
                  </Text>
                  <Text
                    style={[
                      styles.bold,
                      styles.capitalize,
                      { fontSize: smallestFontSize },
                    ]}
                  >
                    {order.company.shift === 'night'
                      ? order.company.shift
                      : categorizeLastName(order.customer.lastName)}
                  </Text>
                </View>
                <Text style={[styles.line, { fontSize: smallestFontSize }]}>
                  {order.restaurant.name}
                </Text>
                <Text
                  style={[
                    styles.line,
                    styles.bold,
                    { fontSize: smallestFontSize },
                  ]}
                >
                  {order.item.name}
                </Text>
                {(order.item.optionalAddons || order.item.requiredAddons) && (
                  <Text style={[styles.line, { fontSize: smallestFontSize }]}>
                    {order.item.requiredAddons} {order.item.optionalAddons}
                  </Text>
                )}
                {order.item.removedIngredients && (
                  <Text style={[styles.line, { fontSize: smallestFontSize }]}>
                    {order.item.removedIngredients}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
