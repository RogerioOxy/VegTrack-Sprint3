import React from 'react';
import { Linking, Text, View } from 'react-native';
import { Colors } from '../utils/theme';

export default function PhotoCredit() {
  return <View style={{ paddingVertical: 8, gap: 4 }}>
    <Text style={{ fontSize: 12, lineHeight: 18, color: Colors.textSecondary }}>Foto de exemplo: Jcomeau ictx. Não foi capturada pelo grupo nem corresponde ao trecho selecionado.</Text>
    <Text style={{ fontSize: 12, lineHeight: 18, color: Colors.primary }}>
      <Text accessibilityRole="link" onPress={() => { void Linking.openURL('https://commons.wikimedia.org/wiki/File:Another_view_of_the_roadside_vegetation.JPG'); }}>Fonte: Wikimedia Commons</Text>
      {' · '}
      <Text accessibilityRole="link" onPress={() => { void Linking.openURL('https://creativecommons.org/licenses/by-sa/3.0/'); }}>CC BY-SA 3.0</Text>
    </Text>
  </View>;
}
