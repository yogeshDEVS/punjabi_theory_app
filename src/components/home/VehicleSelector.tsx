import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

import type { Vehicle } from '../../features/home/data';
import { vehicles } from '../../features/home/data';
import { homePalette } from '../../features/home/theme';

interface VehicleSelectorProps {
  selectedVehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

function VehicleSelector({
  selectedVehicle,
  onSelect,
}: VehicleSelectorProps): React.JSX.Element {
  return (
    <View>


      <View style={styles.vehicleRow}>
        {vehicles.map(vehicle => {
          const isSelected = vehicle.id === selectedVehicle;

          return (
            <Pressable
              key={vehicle.id}
              onPress={() => onSelect(vehicle.id)}
              style={[styles.vehicleChip, isSelected && styles.vehicleChipActive]}>
              <MaterialIcons
                name={vehicle.icon}
                size={24}
                color={isSelected ? homePalette.white : homePalette.navy}
                style={styles.vehicleIcon}
              />
              <Text
                style={[
                  styles.vehicleLabel,
                  isSelected && styles.vehicleLabelActive,
                ]}>
                {vehicle.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: homePalette.ink,
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    marginBottom: 10,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  vehicleChip: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: homePalette.white,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: homePalette.navy,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minHeight: 58,
    shadowColor: homePalette.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  vehicleChipActive: {
    backgroundColor: homePalette.navy,
    borderColor: homePalette.navy,
  },
  vehicleIcon: {
    marginBottom: 0,
  },
  vehicleLabel: {
    color: homePalette.ink,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  vehicleLabelActive: {
    color: homePalette.white,
  },
});

export default VehicleSelector;
