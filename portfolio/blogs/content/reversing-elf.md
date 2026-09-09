---
title: TryHackMe: Reversing Elf
dateWritten: 09/09/2026
datePublished: 
tags: Reverse Engineering
banner: ../../assets/banners/thm.png
description: My first experience with reverse engineering on TryHackMe, exploring Linux executables, strings analysis, IDA pseudocode and basic XOR decoding.
category: Other
---

I was recently recommended TryHackMe as a resource for learning about reverse engineering. While browsing the available rooms and CTFs, I looked for something suitable for a beginner and came across 'Reversing ELF'. This room teaches the basics of reverse engineering Linux executable files.

LEARNING[ELF stands for 'Executable and Linkable Format'. It is a standard file format used for executable programs, object code, shared libraries, and core dumps on Linux and other Unix-like systems.]

As I had no prior experience with reverse engineering, I looked up a [guide](https://medium.com/@sturu/tryhackme-reversing-elf-writeup-3a58217a8407) to reference if I got stuck. Where relied upon, I have explicitly stated it.

Tools Used:
1. Kali Linux - used as the environment
2. IDA Free - a disassembler and decompiler

## Task 1
Following the guide, I used the following command to make the crackme file executable, and run it:
`chmod +x '/home/kali/Desktop/crackme1'  && '/home/kali/Desktop/crackme1'`. 
This produced the flag.

LEARNING[`chmod` is a command used to change the permissions of a file or directory. In this case, `+x` adds executable permission, allowing the file to be run as a program]

## Task 2
Continuing with the guide, I used the `strings` command on the second crackme file. This revealed the following:
```
/usr/local/lib:$ORIGIN
__gmon_start__
GLIBC_2.0
PTRh 
j3jA
[^_]
UWVS
t$,U
[^_]
Usage: %s password
super_secret_password
Access denied.
Access granted.
```
The string `super_secret_password` stood out as a potential password. I then used the following command to make the file executable and run it, providing the password as an argument:
`chmod +x '/home/kali/Desktop/crackme2'  && '/home/kali/Desktop/crackme2' super_secret_password`.
This successfully produced the flag.

## Task 3
For the third crackme, I used the strings command again, revealing the following:
```
Usage: %s PASSWORD
malloc failed
ZjByX3kwdXJfNWVjMG5kX2xlNTVvbl91bmJhc2U2NF80bGxfN2gzXzdoMW5nNQ==
Correct password!
Come on, even my aunt Mildred got this one!
```
The string above 'Correct password!' was easily recognisable as Base64, which was then decoded using this command: `echo ZjByX3kwdXJfNWVjMG5kX2xlNTVvbl91bmJhc2U2NF80bGxfN2gzXzdoMW5nNQ== | base64 --decode`

## Task 4
Once again using the `strings` command for `crackme4`, I found the following:
```
password OK
password "%s" not OK
Usage : %s password
This time the string is hidden and we used strcmp
```
Unlike the previous crackme, the password itself was not visible in the output, with the final line suggesting the use of `strcmp` to compare the entered password with the correct password.

LEARNING[`strcmp` is a C function that compares two strings character by character and returns 0 if they are identical.]

The TryHackMe hint for this task was 'IDA / Radare2', so I downloaded IDA Free and opened the crackme file. Using the F5 shortcut, I switched to the pseudocode view, as it converts IDA's disassembly into something closer to readable C code rather than raw assembly instructions. Within the pseudocode, I found a function named `get_pwd`, containing the following:
```
__int64 __fastcall get_pwd(__int64 a1)
{
    __int64 result; // rax
    int i; // [rsp+14h] [rbp-4h]

    for ( i = -1; ; *(_BYTE *)(a1 + i) = *(_BYTE *)(i + a1) ^ 0x24 )
    {
        result = *(unsigned __int8 *)(++i + a1);
        if ( (_BYTE)result == 0 )
        break;
    }
    return result;
}
```
This representation was still difficult to understand, so using Claude, I received this python command to run:
```python
python3 -c "
import struct
b = struct.pack('<Q', 0x7B175614497B5D49) + struct.pack('<Q', 0x547B175651474157)
decoded = bytes(c ^ 0x24 for c in b)

if 0 in decoded:
decoded = decoded[:decoded.index(0)]
print(decoded)
"
```
Running this command successfully produced the flag. After completing the room, I revisited the pseudocode to understand how it works and why the Python script is able to solve the crackme. 
Looking at the pseudocode for `main` and the `compare_pwd` function within it, it seems to load two hardcoded encrypted values into memory: `0x7B175614497B5D49LL` and `0x547B175651474157LL`. `get_pwd` seems to then XOR these bytes with `0x24` to decrypt them. The Python function simply uses those 2 hardcoded values and XORs them with `0x24` to decrypt it, mirroring `get_pwd`.


## Task 5
Once again, I opened the file in IDA and navigated to the `main` function. I found the following line, which immediately stood out:
``qmemcpy(v5, "OfdlDSA|3tXb32~X3tX@sX`4tXtz", 28);``
This value appeared to be hardcoded into the program, so I tried it as the flag, and it was correct. After completing the room, I revisited this section of the pseudocode to understand why this worked. `qmemcpy()` copies this hardcoded value into `v5`. Later in the pseudocode, the user input is stored in `v4`, and the two values are compared with each other using `if ( (unsigned int)strcmp_(a1: v4, a2: v5) == 0 )`. This comparison is what justifies the hardcoded value as being the flag for the question.

LEARNING[qmemcpy() is a memory-copying function. It copies a fixed number of bytes from one location to another, in this case straight from a hardcoded string into a buffer.]

## Task 6
I opened the file in IDA and navigated to the `main` function. From there, I found a `compare_pwd` function, which led me to a `my_secure_test` function. Inside `my_secure_test`, I found a series of `if` statements that compared characters against ASCII values. For example:
`if ( *a1 != 49 ) return 0xFFFFFFFFLL;`.
I converted each of the ASCII values in the function into their corresponding characters, which produced the flag.

## Task 7
I opened the file in IDA and found a `giveFlag()` function within an `else if` statement in `main`. I then examined the condition that needed to be satisfied:
`else if ( v7[0] == 31337 )`
From this, I inferred that entering the value `31337` when running the program would satisfy the condition and cause the `giveFlag()` function to execute, which was correct.

## Task 8
Similarly to Task 7, I opened the file in IDA and found a `giveFlag()` function within an `if` statement. I then examined the condition again:
`if ( atoi(nptr: argv[1]) == -889262067 )`
The use of `atoi()` indicated that the program was converting the first command-line argument into an integer before comparing it with `-889262067`. I therefore inferred that this value needed to be supplied as the first argument when running the program.
I tested this using:
`'/home/kali/Desktop/crackme8' -889262067`, which successfully returned the flag.

LEARNING[atoi() converts a string of digits into its integer value.]

<hr>

This room has taught me a lot, despited being labelled as an 'easy' room. It has given me my first introduction to reverse engineering and has helped me understand how tools such as IDA can be used to analyse an executable and work backwards from its behaviour.

As a next step, I want to learn more about the language and concepts behind IDA's pseudocode so I can better understand what I am seeing. I also plan to work through some more beginner-friendly reverse engineering rooms to build on what I have learned.

Although this was a TryHackMe room rather than a traditional CTF, I wanted to document the experience as a write-up. Writing about the process has helped me reflect on what I actually understood and what I still need to learn.