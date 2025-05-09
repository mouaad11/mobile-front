import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

const { width, height } = Dimensions.get('window');

export const commonStyles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
    },
    
    // Card styles
    card: {
        backgroundColor: Colors.CARD_BACKGROUND,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    
    // Text styles
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.TEXT_PRIMARY,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.TEXT_SECONDARY,
        marginBottom: 4,
    },
    body: {
        fontSize: 16,
        color: Colors.TEXT_SECONDARY,
        lineHeight: 24,
    },
    
    // Button styles
    button: {
        backgroundColor: Colors.ACCENT,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Input styles
    input: {
        backgroundColor: Colors.CARD_BACKGROUND,
        borderRadius: 8,
        padding: 16,
        color: Colors.TEXT_PRIMARY,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.TEXT_MUTED,
    },
    
    // Movie card specific styles
    movieCard: {
        width: width * 0.7,
        height: height * 0.4,
        marginRight: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    moviePoster: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    movieInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    
    // Loading and error states
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    
    // Layout helpers
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 