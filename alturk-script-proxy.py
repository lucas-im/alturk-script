from pynput import keyboard
from PIL import Image
import pyperclip
import time

#global vars
ts1 = 0.0
ts2 = 0.0
img_file = ''

#set this to ref images folder
target_dir = 'D:\w10_others'

#todo: bind all folders so don't need tot chnage dirs 

def on_press(key):
    global ts1, ts2
    key_str = str(key).strip("'")
    if key_str == 'e':
        if ts1 == 0.0:
            ts1 = time.time()
            return
        elif ts2 == 0.0:
            ts2 = time.time()
        if ts2 - ts1 < 0.2:
            try:
                img_file = pyperclip.paste()
                img = Image.open(f'{target_dir}/{img_file}.png')
                img.show()
                print(f'opening{img.file}.png')
            except:
                print('invalid path or file name')
        else:
            ts1 = 0.0
            ts2 = 0.0

print(f'script running on:{target_dir}')

with keyboard.Listener(
        on_press=on_press) as listener:
        listener.join()