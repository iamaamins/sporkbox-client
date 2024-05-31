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
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    marginHorizontal: 4.5,
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

type Label = {
  customer: {
    firstName: string;
    lastName: string;
    shift: string;
  };
  restaurant: string;
  item: {
    name: string;
    addons: string;
    removed: string;
  };
};

type Props = {
  labels: Label[];
};

export default function Labels({ labels }: Props) {
  function calculateFontSize(
    text: string,
    maxWidth: number,
    hasAddons: boolean
  ) {
    const fontSize = hasAddons ? 8 : 10;
    const charWidth = fontSize * 0.6;
    const textWidth = text.length * charWidth;
    if (textWidth <= maxWidth) return fontSize;
    return maxWidth / text.length / 0.6;
  }

  const label = labels[0];
  console.log(!!label.item.removed, !!label.item.addons);

  return (
    <Document>
      <Page size='LETTER' style={styles.page}>
        {labels.map((label, index) => {
          const nameShift = `${label.customer.firstName} ${
            label.customer.lastName
          } - ${
            label.customer.shift === 'night'
              ? label.customer.shift
              : categorizeLastName(label.customer.lastName)
          }`.trim();
          const restaurant = label.restaurant.trim();
          const item = label.item.name.trim();
          const addons = label.item.addons.trim();
          const removed = label.item.removed.trim();

          const hasAddons = !!label.item.addons || !!label.item.removed;
          const lineWidth = styles.line.width;

          const fontSize = Math.min(
            calculateFontSize(nameShift, lineWidth, hasAddons),
            calculateFontSize(restaurant, lineWidth, hasAddons),
            calculateFontSize(item, lineWidth, hasAddons),
            calculateFontSize(addons, lineWidth, hasAddons),
            calculateFontSize(removed, lineWidth, hasAddons)
          );

          return (
            <View key={index} style={styles.label} wrap={false}>
              <Image src='/label-icon.png' style={styles.logo} />
              <View>
                <View style={[styles.name_shift, styles.line]}>
                  <Text style={[styles.bold, { fontSize }]}>
                    {label.customer.lastName}{' '}
                  </Text>
                  <Text style={{ fontSize }}>
                    {label.customer.firstName} -{' '}
                  </Text>
                  <Text style={[styles.bold, styles.capitalize, { fontSize }]}>
                    {label.customer.shift === 'night'
                      ? label.customer.shift
                      : categorizeLastName(label.customer.lastName)}
                  </Text>
                </View>
                <Text style={[styles.line, { fontSize }]}>{restaurant}</Text>
                <Text style={[styles.line, styles.bold, { fontSize }]}>
                  {item}
                </Text>
                <Text style={[styles.line, { fontSize }]}>{addons}</Text>
                <Text style={[styles.line, { fontSize }]}>{removed}</Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
