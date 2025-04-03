import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  Modal,
  type MeasureInWindowOnSuccessCallback, 
  ActivityIndicator
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../utils/supabase';

type Props = {
  onStatusChange?: (status: { toWatch: boolean; watching: boolean }) => void;
  userId: string;
  showId: number;
  showName: string;
};

const WatchlistPopup = ({ onStatusChange, userId, showId, showName }: Props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [toWatch, setToWatch] = useState(false);
  const [watching, setWatching] = useState(false);
  const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    const measurementCallback: MeasureInWindowOnSuccessCallback = (x, y, width, height) => {
      setButtonLayout({ x, y, width, height });
      setShowPopup(true);
    };
    
    buttonRef.current?.measureInWindow(measurementCallback);
  };

  const handleStatusChange = async (type: 'to-watch' | 'watched') => {
    try {
      setLoading(true);
      
      const updates = {
        user_id: userId, // Changed from user_id to match DB column name
        show_id: showId,
        show_name: showName,
        to_watch: type === 'to-watch' ? !toWatch : false,
        watching: type === 'watched' ? !watching : false,
      };
  
      // Use the constraint name for onConflict
      const { error } = await supabase
        .from('UserShows')
        .upsert(updates, {
          onConflict: 'user_id,show_id', // Match your unique constraint columns
        });
  
      if (error) throw error;
  
      // Update local state
      if (type === 'to-watch') {
        setToWatch(prev => !prev);
        setWatching(false);
      } else {
        setWatching(prev => !prev);
        setToWatch(false);
      }
  
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
      setShowPopup(false);
    }
  };

  useEffect(() => {
    const loadInitialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('UserShows')
          .select('to_watch, watching')
          .eq('user_id', userId)
          .eq('show_id', showId)
          .single();

        if (!error && data) {
          setToWatch(data.to_watch);
          setWatching(data.watching);
        }
      } catch (error) {
        console.error('Error loading watch status:', error);
      }
    };

    loadInitialStatus();
  }, [userId, showId]);

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.actionButton}
        onPress={handlePress}
      >
        <FontAwesome name="play-circle" size={30} color="white" />
        <Text style={styles.actionText}>Watchlist</Text>
      </TouchableOpacity>

      <Modal visible={showPopup} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowPopup(false)}>
          <View style={styles.overlay}>
            <View style={[
              styles.popup,
              { 
                top: buttonLayout.y + buttonLayout.height,
                left: buttonLayout.x + (buttonLayout.width/2 - 60),
              }
            ]}>
              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  toWatch && styles.selectedOption
                ]}
                onPress={() => handleStatusChange('to-watch')}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text style={styles.optionText}>To Watch</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.optionButton,
                  watching && styles.selectedOption
                ]}
                onPress={() => handleStatusChange('watched')}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text style={styles.optionText}>Watched</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

// Styles remain the same as previous version
const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  popup: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 4,
  },
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  optionText: {
    color: 'black',
    fontSize: 16,
  },
});

export default WatchlistPopup;