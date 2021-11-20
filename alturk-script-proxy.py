from pynput import keyboard
from PIL import Image
import pyperclip, time, os, sys


#global vars
ts1 = 0.0
ts2 = 0.0
img_file = ''
slp_duration = 0
ref_num = 13

# set this to ref images folder
target_dir = f'D:/w{ref_num}_others'

# todo: bind all folders so don't need tot chnage dirs


def on_press(key):
    global slp_duration, ref_num, target_dir
    key_str = str(key).strip("'")
    if key_str == 's':
        time.sleep(0.1)
        img_file = pyperclip.paste()
        # print(f'opening {img_file}.png')
        # img = Image.open(f'{target_dir}/{img_file}')

        # img.show()
        print(f'opening {img_file}...')
        os.startfile(f'{target_dir}/{img_file}')
    elif key_str == 'q':
        duration = 10
        print(f'key listening halted for {duration}seconds')
        time.sleep(duration)
        print('halt lifted')
    elif key_str == '`':
        print('enter reference number in NN(ex: 04) format')
        print("\033c")
        inp = input()
        
        if inp:
            
            target_dir = f'D:/w{ref_num}_others'
            print(f'target directory set to {target_dir}')
        else:
            print('invalid input')
        

        


print(f'script running on:{target_dir}. press s to show img, press q to halt, press `(backtic) to change ref number')

with keyboard.Listener(
        on_press=on_press) as listener:
    listener.join()
