import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
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
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
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
        <View style={styles.header}>
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
            Client: {estimate?.entity?.name || 'Aucun client'}
          </Text>
          <Text style={styles.subtitle}>
            Statut: {estimate?.status || 'N/A'}
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            {estimate?.items.map((item) => (
              <View key={item.id} style={{ marginBottom: 5 }}>
                <View>
                  <Text>{item.name}</Text>
                  <Text>{item.description}</Text>
                </View>
                <Text>{item.quantity}</Text>
                <Text>{item.unitPrice.toFixed(2)} €</Text>
                <Text>
                  {item.quantity} x {item.unitPrice.toFixed(2)} €
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
