import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import React from 'react';

import {
  Entity,
  Estimate,
  EstimateItem,
  Organization,
} from '@/app/generated/prisma';

interface EstimateWithRelations extends Estimate {
  entity: Entity | null;
  organization?: Organization | null;
  items: EstimateItem[];
}

interface MyDocumentProps {
  estimate?: EstimateWithRelations;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  description: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  section: {
    paddingTop: 30,
    flexGrow: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#888888',
  },
});

// Create Document Component
export default function MyDocument({ estimate }: MyDocumentProps) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View>
          <Image
            src='/images/gaspard_icon.png'
            style={{ width: '25px', height: '25px', marginBottom: '10px' }}
          />
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <View style={{ width: '50%' }}>
            <Text style={styles.title}>
              {estimate?.organization?.name || 'Aucune organisation'}
            </Text>
            <Text style={styles.subtitle}>
              Date:{' '}
              {estimate?.createdAt
                ? new Date(estimate.createdAt).toLocaleDateString('fr-FR')
                : 'N/A'}
            </Text>
            <Text style={styles.subtitle}>
              Statut: {estimate?.status || 'N/A'}
            </Text>
          </View>
          <View style={{ width: '50%', textAlign: 'right' }}>
            <Text style={styles.subtitle}>
              Client: {estimate?.entity?.name || 'Aucun client'}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '20px',
              backgroundColor: '#f5f5f5',
              padding: '10px',
              width: '100%',
              marginBottom: '10px',
              borderRadius: '5px',
            }}
          >
            <Text
              style={[styles.subtitle, { flex: '3 0 0px', textAlign: 'left' }]}
            >
              Dénomination
            </Text>
            <Text
              style={[
                styles.subtitle,
                { flex: '1 1 0px', textAlign: 'center' },
              ]}
            >
              Quantité
            </Text>
            <Text
              style={[
                styles.subtitle,
                { flex: '1 1 0px', textAlign: 'center' },
              ]}
            >
              Prix unitaire
            </Text>
            <Text
              style={[styles.subtitle, { flex: '1 1 0px', textAlign: 'right' }]}
            >
              Total
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              gap: '10px',
              display: 'flex',
            }}
          >
            {estimate?.items.map((item) => (
              <View
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 5,
                  gap: '20px',
                  width: '100%',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    flex: '3 0 0px',
                    textAlign: 'left',
                  }}
                >
                  <Text style={styles.subtitle}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
                <Text
                  style={[
                    styles.subtitle,
                    { flex: '1 1 0px', textAlign: 'center' },
                  ]}
                >
                  {item.quantity}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { flex: '1 1 0px', textAlign: 'center' },
                  ]}
                >
                  {item.unitPrice.toFixed(2)} €
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { flex: '1 1 0px', textAlign: 'right' },
                  ]}
                >
                  {(item.quantity * item.unitPrice).toFixed(2)} €
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Montant total:</Text>
            <Text>{estimate?.totalAmount?.toFixed(2) || '0.00'} €</Text>
          </View>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
