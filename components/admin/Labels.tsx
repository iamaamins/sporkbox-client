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

type Props = {
  labels: Order[];
};

export default function Labels({ labels }: Props) {
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
        {labels.map((label) => {
          const nameShift = `${label.customer.firstName} ${
            label.customer.lastName
          } - ${
            label.company.shift === 'night'
              ? label.company.shift
              : categorizeLastName(label.customer.lastName)
          }`;
          const smallerFontSize =
            (label.item.optionalAddons ||
              label.item.requiredAddons ||
              label.item.removedIngredients) &&
            8;
          const smallestFontSize = Math.min(
            smallerFontSize || calculateFontSize(nameShift, styles.line.width)
          );

          return (
            <View key={label._id} style={styles.label} wrap={false}>
              <Image src='/label-icon.png' style={styles.logo} />
              <View>
                <View style={[styles.name_shift, styles.line]}>
                  <Text style={[styles.bold, { fontSize: smallestFontSize }]}>
                    {label.customer.lastName}{' '}
                  </Text>
                  <Text style={{ fontSize: smallestFontSize }}>
                    {label.customer.firstName} -{' '}
                  </Text>
                  <Text
                    style={[
                      styles.bold,
                      styles.capitalize,
                      { fontSize: smallestFontSize },
                    ]}
                  >
                    {label.company.shift === 'night'
                      ? label.company.shift
                      : categorizeLastName(label.customer.lastName)}
                  </Text>
                </View>
                <Text style={[styles.line, { fontSize: smallestFontSize }]}>
                  {label.restaurant.name}
                </Text>
                <Text
                  style={[
                    styles.line,
                    styles.bold,
                    { fontSize: smallestFontSize },
                  ]}
                >
                  {label.item.name}
                </Text>
                {(label.item.optionalAddons || label.item.requiredAddons) && (
                  <Text style={[styles.line, { fontSize: smallestFontSize }]}>
                    {label.item.requiredAddons} {label.item.optionalAddons}
                  </Text>
                )}
                {label.item.removedIngredients && (
                  <Text style={[styles.line, { fontSize: smallestFontSize }]}>
                    {label.item.removedIngredients}
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
