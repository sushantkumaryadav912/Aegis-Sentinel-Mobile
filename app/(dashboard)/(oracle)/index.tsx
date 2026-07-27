import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Send, User as UserIcon, Bot, ArrowRight, ShieldAlert } from 'lucide-react-native';
import { sendOracleQuery } from '../../../src/lib/api/oracle';
import { Card } from '../../../src/components/ui/Card';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { OracleMessage } from '../../../src/lib/types';
import { formatTimestamp } from '../../../src/lib/utils';
import { colors } from '../../../src/theme/colors';
import { fonts } from '../../../src/theme/typography';

const QUICK_PROMPTS = [
  'Assess console login anomalies',
  'Generate Terraform remediation for public S3',
  'Review active Forge playbooks',
  'Check AWS CloudTrail API anomalies',
];

const INITIAL_MESSAGES: OracleMessage[] = [
  {
    id: 'm1',
    sender: 'bot',
    text: 'Hello! I am Oracle, your AI Security Copilot. I scan the Aegis Sentinel telemetry pipeline, cloud security postures, and active alerts to isolate anomalies.\n\nAsk me about current alerts, remediation guidelines, or write custom playbooks.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    suggestions: [
      'Explain S3 Secrets Bucket Alert',
      'Generate Terraform remediation for public S3',
      'Review active Forge playbooks',
    ],
  },
];

export default function OracleScreen() {
  const [messages, setMessages] = useState<OracleMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || loading) return;

    const userMsg: OracleMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setLoading(true);

    // Scroll to bottom immediately
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const botResponse = await sendOracleQuery(textToSend);
      setMessages((prev) => [...prev, botResponse]);
    } catch (e) {
      const errorMsg: OracleMessage = {
        id: `err_${Date.now()}`,
        sender: 'bot',
        text: 'Unable to connect to Oracle Neural Core. Please check your connection and retry.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: OracleMessage }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.msgContainer, isUser ? styles.userMsgContainer : styles.botMsgContainer]}>
        <View style={[styles.avatarWrapper, isUser && styles.userAvatar]}>
          {isUser ? (
            <UserIcon size={14} color="#000" />
          ) : (
            <Bot size={16} color={colors.primary} />
          )}
        </View>

        <View style={[styles.bubbleWrapper, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.msgText, isUser && styles.userMsgText]}>{item.text}</Text>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>
            {formatTimestamp(item.timestamp)}
          </Text>

          {item.suggestions && item.suggestions.length > 0 && (
            <View style={styles.suggestionRow}>
              <Text style={styles.suggestionHeader}>SUGGESTED ACTIONS:</Text>
              {item.suggestions.map((sug, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSend(sug)}
                  style={styles.suggestionChip}
                >
                  <Text style={styles.suggestionText}>{sug}</Text>
                  <ArrowRight size={12} color={colors.primary} />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.container}
      >
        <ScreenHeader
          title="ORACLE COPILOT"
          subtitle="AI Copilot for cloud anomaly identification and response"
          action={
            <View style={styles.statusPill}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>AI ONLINE</Text>
            </View>
          }
        />

        {/* Quick Prompts Horizontal ScrollBar */}
        <View style={styles.quickPromptsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPromptsScroll}>
            {QUICK_PROMPTS.map((prompt, i) => (
              <Pressable key={i} style={styles.quickPromptChip} onPress={() => handleSend(prompt)}>
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Chat Stream */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.flatList}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={styles.typingBox}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.typingText}>Oracle AI is analyzing telemetry & rules...</Text>
          </View>
        )}

        {/* Chat Input Bar - Flex pinned above keyboard & bottom tab bar */}
        <View style={styles.inputBarWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Ask Oracle about threats, alerts, playbooks..."
              placeholderTextColor={colors.mutedForeground}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
              style={styles.textInput}
              returnKeyType="send"
            />
            <Pressable
              onPress={() => handleSend()}
              disabled={!inputText.trim() || loading}
              style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnDisabled]}
            >
              <Send size={18} color="#030712" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  quickPromptsWrapper: {
    marginVertical: 10,
  },
  quickPromptsScroll: {
    gap: 8,
    paddingHorizontal: 2,
  },
  quickPromptChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(0, 229, 255, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  quickPromptText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  flatList: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 12,
    paddingBottom: 24,
    gap: 14,
  },
  msgContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 4,
    maxWidth: '88%',
  },
  userMsgContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botMsgContainer: {
    alignSelf: 'flex-start',
  },
  avatarWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  userAvatar: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bubbleWrapper: {
    padding: 14,
    borderRadius: 16,
    flexShrink: 1,
  },
  botBubble: {
    backgroundColor: '#0c1633',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  msgText: {
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 20,
  },
  userMsgText: {
    color: '#030712',
    fontWeight: '600',
  },
  timeText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.slate[400],
    marginTop: 6,
    textAlign: 'right',
  },
  userTimeText: {
    color: 'rgba(3, 7, 18, 0.6)',
  },
  suggestionRow: {
    marginTop: 10,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  suggestionHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderColor: 'rgba(0, 229, 255, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  suggestionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  typingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  typingText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.primary,
  },
  inputBarWrapper: {
    paddingVertical: 8,
    paddingBottom: 8,
    marginBottom: 0,
    backgroundColor: colors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1633',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    paddingHorizontal: 12,
    height: 52,
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  textInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 14,
    height: '100%',
    paddingRight: 8,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.3,
  },
});
