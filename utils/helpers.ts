// utils/helpers.ts
export const formatRating = (rating: string | undefined): string => {
  if (!rating || rating === 'N/A') return '';
  return rating;
};

export const formatRuntime = (minutes: string | undefined): string => {
  if (!minutes || minutes === 'N/A') return '';
  const min = parseInt(minutes);
  if (isNaN(min)) return minutes;
  
  const hours = Math.floor(min / 60);
  const remainingMinutes = min % 60;
  
  if (hours === 0) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString || dateString === 'N/A') return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const getYearFromTitle = (fullTitle: string): string => {
  const match = fullTitle.match(/\((\d{4})\)/);
  return match ? match[1] : '';
};

export const cleanImageUrl = (url: string): string => {
  if (!url) return '';
  // Remove any size parameters to get the full-size image
  return url.replace(/_V1_.*\.jpg/, '_V1_.jpg');
};

export const shareTitle = async (title: string, id: string): Promise<void> => {
  const url = `${window.location.origin}/title/${id}`;
  const text = `Check out "${title}" on MovieFinder`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: text,
        url: url,
      });
    } catch (error) {
      console.log('Error sharing:', error);
      fallbackShare(url, text);
    }
  } else {
    fallbackShare(url, text);
  }
};

const fallbackShare = (url: string, text: string): void => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Link copied to clipboard!');
  }
};
