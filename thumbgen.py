import argparse
import av  # pip install av
import os.path
import subprocess


def popen_results(args):
    proc = subprocess.Popen(args, stdout=subprocess.PIPE)
    return proc.communicate()[0]


def frames(filename):
  with open(filename) as f:
    media = av.open(f)
    return float(media.duration) / 1000000.


def get_frame(video_filename, nth_frame, total=40):
  total_frames = frames(video_filename)
  frame_number = total_frames / total * nth_frame
  frame_filename = '%s_%02d.bmp' % (
    os.path.basename(video_filename).split(".")[0], nth_frame)
  args = "ffmpeg -y -accurate_seek -ss %d -i %s -frames:v 1 %s" % (
          frame_number, video_filename, frame_filename)
  res = popen_results(args.split())


def get_all_frames(filename, total_frames):
  for frame in range(total_frames):
    get_frame(filename, frame, total_frames)

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Extract frames from a video to bmp files',
      formatter_class=argparse.ArgumentDefaultsHelpFormatter)

  parser.add_argument('video_filename', metavar='filename', help='a video file that ffpmeg can open')
  parser.add_argument('frame_count', nargs='?', type=int, default=10, help='number of frames you want to extract')
  args = parser.parse_args()

  if args.video_filename:
    get_all_frames(args.video_filename, args.frame_count)
