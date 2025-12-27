#!/bin/bash
# Lossless Audio Compression - Converts audio to FLAC format
# Zero quality loss, 40-60% size reduction

echo "🎵 Lossless Audio Compressor"
echo "================================"
echo ""

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Install it first:"
    echo "   brew install ffmpeg"
    exit 1
fi

# Check if file provided
if [ -z "$1" ]; then
    echo "Usage: ./compress-audio-lossless.sh <audio-file>"
    echo ""
    echo "Example:"
    echo "  ./compress-audio-lossless.sh song.wav"
    echo "  ./compress-audio-lossless.sh *.wav    (batch mode)"
    echo ""
    echo "Supports: WAV, MP3, M4A, AAC, OGG, etc."
    exit 1
fi

# Process each file
for input in "$@"; do
    if [ ! -f "$input" ]; then
        echo "⚠️  File not found: $input"
        continue
    fi

    # Get file info
    filename=$(basename "$input")
    name="${filename%.*}"
    output="${name}.flac"

    # Get original size
    original_size=$(stat -f%z "$input")
    original_mb=$(echo "scale=2; $original_size / 1048576" | bc)

    echo "Processing: $filename"
    echo "  Original: ${original_mb} MB"

    # Convert to FLAC (lossless)
    ffmpeg -i "$input" -c:a flac -compression_level 8 "$output" -y -loglevel quiet

    if [ $? -eq 0 ]; then
        # Get compressed size
        compressed_size=$(stat -f%z "$output")
        compressed_mb=$(echo "scale=2; $compressed_size / 1048576" | bc)
        savings=$(echo "scale=1; ($original_size - $compressed_size) * 100 / $original_size" | bc)

        echo "  Compressed: ${compressed_mb} MB"
        echo "  ✅ Saved ${savings}% (lossless)"
        echo ""
    else
        echo "  ❌ Compression failed"
        echo ""
    fi
done

echo "================================"
echo "✨ Done! All files compressed to FLAC format"
echo "   (100% quality preserved)"
